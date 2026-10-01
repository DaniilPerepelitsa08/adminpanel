import { PublicUser } from "@/lib/api";
import styles from "../users.module.css";

type Role = PublicUser["role"];

type EditUserModalProps = {
  user: PublicUser;
  name: string;
  role: Role;
  canChangeRole: boolean;
  error: string;
  onNameChange: (value: string) => void;
  onRoleChange: (value: Role) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function EditUserModal({
  user,
  name,
  role,
  canChangeRole,
  error,
  onNameChange,
  onRoleChange,
  onSave,
  onClose,
}: EditUserModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Edit user</h2>
        <p className={styles.muted}>{user.email}</p>

        {error ? <p className={styles.error}>{error}</p> : null}

        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>

        {canChangeRole ? (
          <label className={styles.label}>
            Role
            <select
              className={styles.input}
              value={role}
              onChange={(e) => onRoleChange(e.target.value as Role)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </label>
        ) : null}

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.save} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
