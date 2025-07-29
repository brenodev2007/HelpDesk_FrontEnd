import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openProfileModal = () => {
    navigate("/profile", { state: { backgroundLocation: location } });
  };

  return (
    <nav className={styles.sidebar}>
      <ul>
        <li>
          <button onClick={openProfileModal} className={styles.linkButton}>
            <FiUser className={styles.icon} />
            Perfil
          </button>
        </li>

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

        {user?.role === "TECNICO" && (
          <li>
            <NavLink
              to="/tecnico"
              onClick={() => onTecnicoClick?.()}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              <FiTool className={styles.icon} />
              Técnico
            </NavLink>
          </li>
        )}

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
