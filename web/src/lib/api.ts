import { apiDelete, apiGet, apiPatch, apiPost } from "./apiClient";

export type PublicUser = {
  id: number;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "user";
  createdAt: string;
};

export type LoginResponse = {
  token: string;
  user: PublicUser;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/auth/login", { email, password });
}

export async function register(name: string, email: string, password: string): Promise<{ user: PublicUser }> {
  return apiPost<{ user: PublicUser }>("/auth/register", {
    name,
    email,
    password,
  });
}

export async function getAllUsers(): Promise<PublicUser[]> {
  return apiGet<PublicUser[]>("/users/all");
}

export async function updateUser(id: number, input: { name?: string; role?: string }): Promise<PublicUser> {
  return apiPatch<PublicUser>(`/users/update/${id}`, input);
}

export async function deleteUser(id: number): Promise<void> {
  return apiDelete(`/users/${id}`);
}

export async function createUser(name: string, email: string, password: string, role: string): Promise<PublicUser | void> {
  return apiPost<PublicUser | void>("/users/create", {
    name,
    email,
    password,
    role,
  });
}