import React from "react";
import { User } from "../types/User";
import styles from "./styles/ProfileInfo.module.css";

export const ProfileInfo: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className={styles.container}>
      <img
        src={user.avatarUrl || "/default-avatar.png"}
        alt={`${user.name} avatar`}
        className={styles.avatar}
      />
      <h2 className={styles.name}>{user.name}</h2>
      <p className={styles.info}>Email: {user.email}</p>
      <p className={styles.info}>Role: {user.role}</p>
    </div>
  );
};
