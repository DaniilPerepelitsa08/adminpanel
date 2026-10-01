"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, PublicUser, updateUser } from "@/lib/api";
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
  const [usersList, setUsersList] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<PublicUser | null>(null);
  const [editName, setEditName] = useState("");

  async function loadUsers() {
    try {
      const users = await getAllUsers();
      setUsersList(users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  function openEdit(user: PublicUser) {
    setEditUser(user);
    setEditName(user.name);
  }

  function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function closeEdit() {
    setEditUser(null);
    setEditName("");
  }

  async function saveEdit() {
    if (!editUser) return;
    try {
      await updateUser(editUser.id, editName);
      await loadUsers();

      closeEdit();
    } catch (e) {
      console.error(e);
    }
  }

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

      return;
    }

    void loadUsers();
  }, [router]);

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

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>All users</h2>
          <span className={styles.count}>{usersList.length} total</span>
        </div>

        {loading ? (
          <p className={styles.muted}>Loading users...</p>
        ) : usersList.length === 0 ? (
          <p className={styles.muted}>No users found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.idCell}>{item.id}</td>
                    <td>{item.name}</td>
                    <td className={styles.emailCell}>{item.email}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[`role_${item.role}`]}`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button type="button" className={styles.edit} onClick={() => openEdit(item)}>
                          Edit
                        </button>
                        <button className={styles.delete} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editUser ? (
                <div className={styles.overlay} onClick={closeEdit}>
                  <div
                      className={styles.modal}
                      onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className={styles.modalTitle}>Edit user</h2>
                    <p className={styles.muted}>{editUser.email}</p>

                    <label className={styles.label}>
                      Name
                      <input
                          className={styles.input}
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                      />
                    </label>

                    <div className={styles.modalActions}>
                      <button type="button" className={styles.cancel} onClick={closeEdit}>
                        Cancel
                      </button>
                      <button type="button" className={styles.save} onClick={saveEdit}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
