import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ProfileInfo } from "../components/ProfileInfo";
import { EditProfileForm } from "../components/EditProfileForm";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/User";
import styles from "./styles/Profile.module.css";

import api from "../services/api";

export const Profile: React.FC = () => {
  const { user, logout, loading, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <p>Carregando perfil...</p>;
  }

  if (!user) {
    return <p>Você não está logado.</p>;
  }

  const handleUpload = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // ✅ importante

      const token = localStorage.getItem("token");
      const res = await api.patch("/clientes/uploadPerfil", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      const updatedUser: User = {
        ...user,
        avatarUrl: data.user.profileImage, // ou .avatar se for isso
      };

      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Falha ao enviar imagem de perfil.");
    } finally {
      setUploading(false);
    }
  };

  const handleHomeClick = () => {
    if (user.role === "TECNICO") {
      navigate("/tecnico");
    } else if (user.role === "USER" || user.role === "ADMIN") {
      navigate("/criar-chamado");
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      {isEditing ? (
        <EditProfileForm
          user={user}
          onSave={handleUpload}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ProfileInfo user={user} />
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.edit}`}
              onClick={() => setIsEditing(true)}
              disabled={uploading}
            >
              Editar Foto
            </button>
            <button
              className={`${styles.button} ${styles.logout}`}
              onClick={logout}
              disabled={uploading}
            >
              Logout
            </button>
            <button
              className={`${styles.button} ${styles.home}`}
              onClick={handleHomeClick}
              style={{ marginLeft: 12 }}
              disabled={uploading}
            >
              Home
            </button>
          </div>
          {uploading && <p>Enviando imagem...</p>}
        </>
      )}
    </div>
  );
};
