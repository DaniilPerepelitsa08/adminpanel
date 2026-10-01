export type Role = "superadmin" | "admin" | "user";

export type Permission = "users.read" | "users.update" | "users.delete";

export interface User {
    id: number;
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
}

export type UpdateUserInput = Partial<Pick<User, "name" | "email" | "role">>;

export type PublicUser = Omit<User, "passwordHash">;