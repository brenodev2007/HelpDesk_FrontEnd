import React, { useState } from "react";
import { Header } from "../components/Header";
import { ProfileInfo } from "../components/ProfileInfo";
import { EditProfileForm } from "../components/EditProfileForm";
import { useAuth } from "../hooks/useAuth"; // seu hook para pegar o contexto
import { User } from "../types/User";

export const Profile: React.FC = () => {
  const { user, logout } = useAuth(); // pega user e logout do contexto
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <p>Você não está logado.</p>;
  }

  const handleSave = (updatedUser: User) => {
    console.log("Salvando usuário atualizado:", updatedUser);
    // Aqui você pode atualizar o usuário na API e no contexto (precisa implementar)
    setIsEditing(false);
  };

  return (
    <div>
      <Header />
      {isEditing ? (
        <EditProfileForm user={user} onSave={handleSave} />
      ) : (
        <>
          <ProfileInfo user={user} />
          <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
          <button
            onClick={logout} // chama logout do contexto
            style={{ marginLeft: "1rem", color: "red" }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};
