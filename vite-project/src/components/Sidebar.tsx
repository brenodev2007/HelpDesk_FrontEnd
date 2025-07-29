import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiList,
  FiLogOut,
  FiSettings,
  FiPlusCircle,
  FiTool,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles/Sidebar.module.css";

type SidebarProps = {
  onTecnicoClick?: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ onTecnicoClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize(); // verifica ao montar
    window.addEventListener("resize", handleResize); // escuta mudanças
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openProfileModal = () => {
    navigate("/profile", { state: { backgroundLocation: location } });
  };

  const sidebarContent = (
    <ul>
      <li>
        <button onClick={openProfileModal} className={styles.linkButton}>
          <FiUser className={styles.icon} />
          <span>Perfil</span>
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
            <span>Criar Chamado</span>
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
            <span>Meus Chamados</span>
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
            <span>Painel do Administrador</span>
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
            <span>Técnico</span>
          </NavLink>
        </li>
      )}

      <li>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FiLogOut className={styles.icon} />
          <span>Logout</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      {isMobile ? (
        <>
          {/* Botão hambúrguer */}
          <button
            className={styles.toggleButton}
            onClick={() => setIsOpen(true)}
          >
            <FiMenu size={24} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className={styles.overlay}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                />

                <motion.nav
                  className={styles.sidebarMobile}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <button
                    className={styles.closeButton}
                    onClick={() => setIsOpen(false)}
                  >
                    <FiX size={24} />
                  </button>
                  {sidebarContent}
                </motion.nav>
              </>
            )}
          </AnimatePresence>
        </>
      ) : (
        <nav className={styles.sidebarDesktop}>{sidebarContent}</nav>
      )}
    </>
  );
};
