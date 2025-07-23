import React, { useState, useEffect } from "react";
import styles from "./styles/EditProfileForm.module.css";

interface Props {
  user: {
    id: string;
    file?: string;
  };
  onSave: (file: File) => void;
  onCancel: () => void;
}

export const EditProfileForm: React.FC<Props> = ({
  user,
  onSave,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user.file || "");

  useEffect(() => {
    if (!selectedFile) {
      setPreview(user.file || "");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, user.file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Selecione uma imagem antes de salvar!");
      return;
    }
    onSave(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="fileInput" className={styles.label}>
        {preview ? (
          <img
            src={preview}
            alt="Preview da imagem"
            className={styles.preview}
          />
        ) : (
          "Clique para selecionar a foto de perfil"
        )}
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
        className={styles.fileInput}
      />

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.buttonCancel}
        >
          Cancelar
        </button>
        <button type="submit" className={styles.buttonSave}>
          Salvar
        </button>
      </div>
    </form>
  );
};
