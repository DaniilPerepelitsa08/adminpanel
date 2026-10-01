"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "@/lib/api";
import styles from "./registration.module.css";

export default function RegistrationPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await register(name, email, password);

            router.push('login')
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <h1 className={styles.brand}>Admin Panel</h1>
                <p className={styles.subtitle}>Sign up to manage users</p>

                <form className={styles.form} onSubmit={onSubmit}>
                    {error ? <p className={styles.error}>{error}</p> : null}

                    <label className={styles.label}>
                        Name
                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>

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
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>
            </section>
        </main>
    )
}