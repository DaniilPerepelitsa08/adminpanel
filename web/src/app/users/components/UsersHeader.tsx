import styles from "../users.module.css";

type UsersHeaderProps = {
  name: string;
  role: string;
  onLogout: () => void;
};

export default function UsersHeader({ name, role, onLogout }: UsersHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Users</h1>
        <p className={styles.muted}>
          Signed in as {name} ({role})
        </p>
      </div>
      <button className={styles.logout} type="button" onClick={onLogout}>
        Log out
      </button>
    </header>
  );
}
