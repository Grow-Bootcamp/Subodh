import styles from "./UserProfile.module.css";

export type User = {
  id: number;
  name: string;
  role: string;
};

type UserProfileProps = {
  user: User;
};

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className={styles.userCard}>
      <div className={styles.userTitle}>
        <b>{user.role}</b>
      </div>
      <div className={styles.userDetails}>
        <b>
          <i>{user.name}</i>
        </b>
        <span className={styles.userId}>User number {user.id}</span>
      </div>
    </div>
  );
};

export default UserProfile;
