import React, { useState } from 'react';
import { User } from '../types/User';

interface Props {
  user: User;
  onSave: (updatedUser: User) => void;
}

export const EditProfileForm: React.FC<Props> = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, name, avatarUrl });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <div>
        <label>Nome:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Avatar URL:</label>
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
};
