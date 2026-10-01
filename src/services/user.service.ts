import { AppError } from "../domain/errors";
import { can } from "../domain/permissions";
import { PublicUser, UpdateUserInput, User } from "../domain/types";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import {Role} from "@prisma/client";

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export class UserService {
  constructor(private readonly users: UserRepository) {}

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
    input: { name?: string; role?: Role }
  ): Promise<PublicUser> {
    if (!can(actor.role, "users.update")) {
      throw new AppError("Missing permission: users.update", 403);
    }

    const user = await this.users.findById(id);

    if (!user) {
      throw new AppError(`User ${id} not found`, 404);
    }

    if (!input.name) {
      throw new AppError("Name can't empty!")
    }

    const updated = await this.users.update(id, input);
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

  async create(
      input: {
        name?: string;
        email?: string;
        password?: string;
        role?: Role;
      },
      actor: User
  ): Promise<PublicUser> {
    if (!can(actor.role, "users.create")) {
      throw new AppError("Missing permission: users.create", 403);
    }

    const { name, email, password, role } = input;

    if (!name || !email || !password || !role) {
      throw new AppError("name, email, password and role required", 400);
    }

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new AppError("User already exists", 409);
    }

    const created = await this.users.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role,
    });

    return toPublicUser(created);
  }
}
