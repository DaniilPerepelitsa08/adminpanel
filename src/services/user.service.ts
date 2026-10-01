import { AppError } from "../domain/errors";
import { can } from "../domain/permissions";
import { PublicUser, UpdateUserInput, User } from "../domain/types";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export class UserService {
  constructor(private readonly users: PrismaUserRepository) {}

  async list(actor: User): Promise<PublicUser[]> {
    if (!can(actor.role, "users.read")) {
      throw new AppError("Missing permission: users.read", 403);
    }

    const users = await this.users.findAll();
    return users.map(toPublicUser);
  }

  async getById(actor: User, id: number): Promise<PublicUser> {
    if (!can(actor.role, "users.read")) {
      throw new AppError("Missing permission: users.read", 403);
    }

    const user = await this.users.findById(id);
    if (!user) {
      throw new AppError(`User ${id} not found`, 404);
    }

    return toPublicUser(user);
  }

  async update(
    id: number,
    actor: User,
    name: string
  ): Promise<PublicUser> {
    if (!can(actor.role, "users.update")) {
      throw new AppError("Missing permission: users.update", 403);
    }

    const user = await this.users.findById(id);

    if (!user) {
      throw new AppError(`User ${id} not found`, 404);
    }

    if (!name) {
      throw new AppError("Name can't empty!")
    }

    const updated = await this.users.update(id, name);
    return toPublicUser(updated);
  }

  async delete(id: number, actor: User): Promise<void> {
    if (!can(actor.role, "users.delete")) {
      throw new AppError("Missing permission: users.delete", 403);
    }

    if (actor.id === id) {
      throw new AppError("Cannot delete yourself", 403);
    }

    const user = await this.users.findById(id);
    if (!user) {
      throw new AppError(`User ${id} not found`, 404);
    }

    await this.users.delete(id);
  }
}
