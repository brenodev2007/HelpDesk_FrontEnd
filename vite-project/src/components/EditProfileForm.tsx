import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import para navegação
import { User } from "../types/User";
import styles from "./styles/EditProfileForm.module.css";

interface Props {
  user: User;
  onSave: (updatedUser: User) => void;
}

export const EditProfileForm: React.FC<Props> = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const navigate = useNavigate(); // instanciar navigate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, name, avatarUrl });
  };

  const handleBack = () => {
    navigate(-1); // volta para página anterior
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label>Nome:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Avatar URL:</label>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleBack} className={styles.button}>
          Voltar
        </button>
        <button type="submit" className={styles.button}>
          Salvar
        </button>
      </div>
    </form>
  );
};
