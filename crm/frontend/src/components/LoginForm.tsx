import { useState } from 'react';
import styles from './LoginForm.module.css';

interface Props {
  onLogin: (login: string, password: string) => Promise<void>;
  onClose: () => void;
}

export default function LoginForm({ onLogin, onClose }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onLogin(login, password);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Вход в CRM</h2>

        <div className={styles.field}>
          <label className={styles.label}>Логин</label>
          <input
            className={styles.input}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={busy}>
          {busy ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}