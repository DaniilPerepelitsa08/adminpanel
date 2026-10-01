"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./users.module.css";

type StoredUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token || !rawUser) {
      router.replace("/login");
      return;
    }

    try {
      setUser(JSON.parse(rawUser) as StoredUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <p className={styles.muted}>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.muted}>
            Signed in as {user.name} ({user.role})
          </p>
        </div>
        <button className={styles.logout} type="button" onClick={logout}>
          Log out
        </button>
      </header>
      <p className={styles.muted}>Users table — next step.</p>
    </main>
  );
}
