type Role = "superadmin" | "admin" | "user";
type Permission =
    | "users.read"
    | "users.create"
    | "users.update"
    | "users.delete";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    superadmin: ["users.read", "users.create", "users.update", "users.delete"],
    admin: ["users.read", "users.update"],
    user: ["users.read"],
};

export function can(role: string, permission: Permission): boolean {
    if (role !== "superadmin" && role !== "admin" && role !== "user") {
        return false;
    }

    return ROLE_PERMISSIONS[role].includes(permission);
}