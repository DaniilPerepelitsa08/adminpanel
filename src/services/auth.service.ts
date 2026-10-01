import bcrypt from "bcrypt";
import { AppError } from "../domain/errors";
import { PublicUser } from "../domain/types";
import { signToken } from "../lib/jwt";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";

export class AuthService {
  constructor(private readonly repo: PrismaUserRepository) {}

  async login(
    email: string | undefined,
    password: string | undefined
  ): Promise<{ token: string; user: PublicUser }> {
    if (!email || !password) {
      throw new AppError("email and password required", 400);
    }

    const user = await this.repo.findByEmail(email);
    const ok = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !ok) {
      throw new AppError("Invalid credentials", 401);
    }

    const { passwordHash: _, ...publicUser } = user;

    return {
      token: signToken(user.id),
      user: publicUser,
    };
  }

  async register(
      name: string | undefined,
      email: string | undefined,
      password: string | undefined
  ): Promise<{user: PublicUser}> {
    if (!name || !email || !password) {
      throw new AppError("All fields required!", 400);
    }

    const user = await this.repo.findByEmail(email);

    if (user) {
      throw new AppError("User already exists!", 401);
    }

    const created = await this.repo.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "user",
    });

    return { user: created };
  }
}
