import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiList, FiLogOut, FiSettings } from "react-icons/fi";

import styles from "./styles/Sidebar.module.css";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.sidebar}>
      <ul>
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
        {/* Link painel do administrador só se user.role === "ADMIN" */}
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
