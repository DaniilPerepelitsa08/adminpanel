import { prisma } from "../lib/prisma";
import { UpdateUserInput, User } from "../domain/types";

type CreateUserInput = Omit<User, "id" | "createdAt">;

export class PrismaUserRepository {
  async findAll() {
    return prisma.user.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserInput) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });
  }

  async update(id: number, name: string) {
    return prisma.user.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
