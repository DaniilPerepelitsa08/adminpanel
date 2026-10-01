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
        throw new Error(data?.message ?? "Login failed");
    }

    return res.json();
}