import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiList,
  FiLogOut,
  FiSettings,
  FiPlusCircle,
  FiTool,
} from "react-icons/fi";

import styles from "./styles/Sidebar.module.css";

type SidebarProps = {
  onTecnicoClick?: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ onTecnicoClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.sidebar}>
      <ul>
        {/* Perfil */}
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            <FiUser className={styles.icon} />
            Perfil
          </NavLink>
        </li>

        {/* Criar Chamado */}
        {user && user.role !== "TECNICO" && (
          <li>
            <NavLink
              to="/criar-chamado"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              <FiPlusCircle className={styles.icon} />
              Criar Chamado
            </NavLink>
          </li>
        )}

        {/* Meus Chamados para ADMIN e USER */}
        {(user?.role === "ADMIN" || user?.role === "USER") && (
          <li>
            <NavLink
              to="/meus-chamados"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              <FiList className={styles.icon} />
              Meus Chamados
            </NavLink>
          </li>
        )}

        {/* Painel do Administrador */}
        {user?.role === "ADMIN" && (
          <li>
            <NavLink
              to="/painel-administrador"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              <FiSettings className={styles.icon} />
              Painel do Administrador
            </NavLink>
          </li>
        )}

        {/* Técnico */}
        {user?.role === "TECNICO" && (
          <li>
            <NavLink
              to="/tecnico"
              onClick={() => {
                if (onTecnicoClick) onTecnicoClick();
              }}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              <FiTool className={styles.icon} />
              Técnico
            </NavLink>
          </li>
        )}

        {/* Logout */}
        <li>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut className={styles.icon} />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};
