"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import styles from "./login.module.css";

export default function LoginPage() {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    const router = useRouter();

    if (token || rawUser) {
        router.replace("/users");
        return;
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/users");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <h1 className={styles.brand}>Admin Panel</h1>
                <p className={styles.subtitle}>Sign in to manage users</p>

                <form className={styles.form} onSubmit={onSubmit}>
                    {error ? <p className={styles.error}>{error}</p> : null}

                    <label className={styles.label}>
                        Email
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        Password
                        <input
                            className={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            />
                    </label>

                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </section>
        </main>
    );
}