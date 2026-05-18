import { useState } from 'react';
import styles from './ApplicationForm.module.css';

interface Props {
  onSubmit: (clientName: string, contact: string, text: string) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ onSubmit, onCancel }: Props) {
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [text, setText] = useState('');
  const [touched, setTouched] = useState({ clientName: false, contact: false });

  const nameError = !clientName.trim() && touched.clientName;
  const contactError = !contact.trim() && touched.contact;
  const isValid = clientName.trim() && contact.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setTouched({ clientName: true, contact: true });
      return;
    }
    onSubmit(clientName.trim(), contact.trim(), text.trim());
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Новая заявка</h2>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>Имя клиента</label>
          <input
            className={styles.input}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, clientName: true }))}
            placeholder="Иван Иванов"
          />
          {nameError && <span className={styles.error}>Обязательное поле</span>}
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>Контакт</label>
          <input
            className={styles.input}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, contact: true }))}
            placeholder="+7 999 123-45-67 или email@example.com"
          />
          {contactError && <span className={styles.error}>Обязательное поле</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Текст заявки</label>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Опишите суть заявки..."
          />
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className={styles.submitBtn}>
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
}
