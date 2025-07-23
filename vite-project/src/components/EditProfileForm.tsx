import React, { useState, useEffect } from "react";
import styles from "./styles/EditProfileForm.module.css";

interface Props {
  user: {
    id: string;
    file?: string;
  };
  onSave: (file: File) => void;
  onCancel: () => void;
  uploading?: boolean;
}

export const EditProfileForm: React.FC<Props> = ({
  user,
  onSave,
  onCancel,
  uploading = false,
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
      <label
        htmlFor="fileInput"
        className={styles.label}
        style={{ cursor: uploading ? "not-allowed" : "pointer" }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview da imagem"
            className={styles.preview}
            style={{ opacity: uploading ? 0.5 : 1 }}
          />
        ) : (
          <span>Clique para selecionar a foto de perfil</span>
        )}
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={uploading}
      />

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.buttonCancel}
          disabled={uploading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.buttonSave}
          disabled={uploading || !selectedFile}
        >
          {uploading ? "Enviando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};
