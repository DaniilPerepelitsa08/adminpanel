"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUser,
  deleteUser,
  getAllUsers,
  PublicUser,
  updateUser,
} from "@/lib/api";

import { can } from "@/lib/permissions";
import styles from "./users.module.css";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import EditUserModal from "./components/EditUserModal";
import AddUserModal from "./components/AddUserModal";
import DeleteUserModal from "./components/DeleteUserModal";

type StoredUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

type Role = PublicUser["role"];

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [usersList, setUsersList] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<PublicUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("user");
  const [deleteTarget, setDeleteTarget] = useState<PublicUser | null>(null);
  const [actionError, setActionError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const canUpdate = user ? can(user.role, "users.update") : false;
  const canDelete = user ? can(user.role, "users.delete") : false;
  const canCreate = user ? can(user.role, "users.create") : false;
  const canChangeRole = user ? user.role === "superadmin" : false;

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

  function openEdit(item: PublicUser) {
    setActionError("");
    setEditUser(item);
    setEditName(item.name);
    setEditRole(item.role);
  }

  function closeEdit() {
    setEditUser(null);
    setEditName("");
    setEditRole("user");
    setActionError("");
  }

  function openAddNewUser() {
    setActionError("");
    setIsAddOpen(true);
  }

  function closeAddNewUser() {
    setIsAddOpen(false);
    setActionError("");
  }

  function openDelete(item: PublicUser) {
    setActionError("");
    setDeleteTarget(item);
  }

  function closeDelete() {
    if (deleting) return;

    setDeleteTarget(null);
    setActionError("")
  }

  async function addNewUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    if (!user) return;

    if (!can(user.role, "users.create")) {
      setActionError("Missing permission: users.create");
      return;
    }

    try {
      setActionError("");
      await createUser(data.name, data.email, data.password, data.role);
      await loadUsers();
      closeAddNewUser();
    } catch (e) {
      console.error(e);
      setActionError(e instanceof Error ? e.message : "Failed to create user");
    }
  }

  async function saveEdit() {
    if (!editUser || !user) return;

    if (!can(user.role, "users.update")) {
      setActionError("Missing permission: users.update");
      return;
    }

    try {
      setActionError("");
      await updateUser(editUser.id, {
        name: editName,
        ...(canChangeRole ? { role: editRole } : {}),
      });
      await loadUsers();
      closeEdit();
    } catch (e) {
      console.error(e);
      setActionError(e instanceof Error ? e.message : "Failed to update user");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !user) return;

    if (!can(user.role, "users.delete")) {
      setActionError("Missing permission: users.delete");
      return;
    }

    try {
      setDeleting(true);
      setActionError("");
      await deleteUser(deleteTarget.id);
      await loadUsers();
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
      setActionError(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setDeleting(false);
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
      <UsersHeader name={user.name} role={user.role} onLogout={logout} />

      <UsersTable
        users={usersList}
        currentUserId={user.id}
        loading={loading}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onAdd={openAddNewUser}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {editUser ? (
        <EditUserModal
          user={editUser}
          name={editName}
          role={editRole}
          canChangeRole={canChangeRole}
          error={actionError}
          onNameChange={setEditName}
          onRoleChange={setEditRole}
          onSave={saveEdit}
          onClose={closeEdit}
        />
      ) : null}

      {deleteTarget ? (
          <DeleteUserModal
              deleteTarget={deleteTarget}
              actionError={actionError}
              confirmDelete={confirmDelete}
              closeDelete={closeDelete}
              deleting={deleting}
          />) : null}

      {isAddOpen ? (
        <AddUserModal
          error={actionError}
          onClose={closeAddNewUser}
          onSubmit={addNewUser}
        />
      ) : null}
    </main>
  );
}