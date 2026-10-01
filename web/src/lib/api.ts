const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
            | { message?: string }
            | null;
        throw new Error(data?.message ?? "Login failed");
    }

    return res.json();
}

export async function register(
    name: string,
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
            | { message?: string }
            | null;
        throw new Error(data?.message ?? "Registration failed");
    }

    return res.json();
}

export async function getAllUsers(): Promise<PublicUser[]> {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Not authenticated!");
    }

    const response = await fetch(`${API_URL}/users/all`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
        throw new Error(data?.message ?? "Failed to fetch users!");
    }

    return response.json();
}

export async function updateUser(
    id: number,
    name: string
): Promise<LoginResponse> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,},
        body: JSON.stringify({ id, name }),
    });

    if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
        throw new Error(data?.message ?? "Registration failed");
    }

    return response.json();
}