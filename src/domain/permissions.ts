import { Permission, Role } from "./types";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    superadmin: ["users.read", "users.update", "users.delete"],
    admin: ["users.read", "users.update"],
    user: [],
};

export function can(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role].includes(permission);
}