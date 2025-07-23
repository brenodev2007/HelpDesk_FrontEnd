import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./styles/Sidebar.module.css";
export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
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
              isActive ? styles.activeLink : undefined
            }
          >
            Perfil
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/meus-chamados"
            className={({ isActive }) =>
              isActive ? styles.activeLink : undefined
            }
          >
            Meus Chamados
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};
