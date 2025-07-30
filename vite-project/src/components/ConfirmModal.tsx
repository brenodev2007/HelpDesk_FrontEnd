import React from "react";
import styles from "./styles/ConfirmModal.module.css";

type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onCancel} />
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={styles.confirm}>
            Confirmar
          </button>
          <button onClick={onCancel} className={styles.cancel}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};
