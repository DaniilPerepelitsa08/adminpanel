import { PublicUser } from "@/lib/api";
import styles from "../users.module.css";

type UsersTableProps = {
  users: PublicUser[];
  currentUserId: number;
  loading: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  onAdd: () => void;
  onEdit: (user: PublicUser) => void;
  onDelete: (user: PublicUser) => void;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UsersTable({
  users,
  currentUserId,
  loading,
  canCreate,
  canUpdate,
  canDelete,
  onAdd,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>All users</h2>
        <div className={styles.cardHeaderActions}>
          <span className={styles.count}>{users.length} total</span>
          {canCreate ? (
            <button type="button" className={styles.add} onClick={onAdd}>
              Add user
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <p className={styles.muted}>Loading users...</p>
      ) : users.length === 0 ? (
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
              {users.map((item) => {
                const isSelf = item.id === currentUserId;
                const showEdit = canUpdate;
                const showDelete = canDelete && !isSelf;

                return (
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
                        {showEdit ? (
                          <button
                            type="button"
                            className={styles.edit}
                            onClick={() => onEdit(item)}
                          >
                            Edit
                          </button>
                        ) : null}
                        {showDelete ? (
                          <button
                            type="button"
                            className={styles.delete}
                            onClick={() => onDelete(item)}
                          >
                            Delete
                          </button>
                        ) : null}
                        {!showEdit && !showDelete ? (
                          <span className={styles.muted}>—</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
