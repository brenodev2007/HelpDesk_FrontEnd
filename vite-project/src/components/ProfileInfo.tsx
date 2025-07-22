import React from "react";
import { User } from "../types/User";

export const ProfileInfo: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <img
        src={user.avatarUrl || "/default-avatar.png"}
        alt={`${user.name} avatar`}
        width={100}
        height={100}
      />
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};
