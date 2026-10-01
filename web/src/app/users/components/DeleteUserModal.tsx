import { PublicUser } from "@/lib/api";
import styles from "../users.module.css";

type DeleteUserModalProps = {
    deleteTarget: PublicUser;
    actionError: string;
    confirmDelete: () => void;
    closeDelete: () => void;
    deleting: boolean;
};
export default function DeleteUserModal({
    deleteTarget,
    actionError,
    confirmDelete,
    closeDelete,
    deleting
    }: DeleteUserModalProps) {
    return (
        <div className={styles.overlay} onClick={closeDelete}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className={styles.modalTitle}>Delete user</h2>
                <p className={styles.muted}>
                    Delete {deleteTarget.name} ({deleteTarget.email})? This cannot be
                    undone.
                </p>

                {actionError ? <p className={styles.error}>{actionError}</p> : null}

                <div className={styles.modalActions}>
                    <button
                        type="button"
                        className={styles.cancel}
                        onClick={closeDelete}
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={styles.confirmDelete}
                        onClick={confirmDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}