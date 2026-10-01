"use client";

import { useState } from "react";
import styles from "../users.module.css";

type AddUserModalProps = {
  error: string;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => void;
};

export default function AddUserModal({
  error,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  function handleSubmit() {
    onSubmit({ name, email, password, role });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Add user</h2>

        {error ? <p className={styles.error}>{error}</p> : null}

        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Role
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
        </label>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.save} onClick={handleSubmit}>
            Add new user
          </button>
        </div>
      </div>
    </div>
  );
}
