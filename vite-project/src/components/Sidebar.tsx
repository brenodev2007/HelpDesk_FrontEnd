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
        {/* Perfil - visível para todos */}
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

        {/* Criar Chamado e Meus Chamados - visível para USER e ADMIN */}
        {user?.role !== "TECNICO" && (
          <>
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
          </>
        )}

        {/* Painel do Administrador - apenas para ADMIN */}
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

        {/* Página do Técnico - apenas para TECNICO */}
        {user?.role === "TECNICO" && (
          <li>
            <NavLink
              to="/tecnico"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              <FiTool className={styles.icon} />
              Técnico
            </NavLink>
          </li>
        )}

        {/* Logout - visível para todos */}
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
