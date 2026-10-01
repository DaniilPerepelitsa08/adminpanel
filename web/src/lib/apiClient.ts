const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
    };

    if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;
        throw new Error(data?.message ?? `Request failed: ${res.status}`);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
    return request<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export function apiDelete<T = void>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
}