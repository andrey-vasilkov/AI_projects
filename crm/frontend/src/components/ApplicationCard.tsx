import type { Application, ApplicationStatus } from '../types';
import styles from './ApplicationCard.module.css';

const statuses: ApplicationStatus[] = ['Новая', 'В работе', 'Завершена'];

interface Props {
  application: Application;
  canEdit: boolean;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationCard({
  application,
  canEdit,
  onStatusChange,
  onDelete,
}: Props) {
  const formattedDate = new Date(application.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{application.clientName}</h3>
        <span className={styles.date}>{formattedDate}</span>
      </div>
      <div className={styles.contact}>{application.contact}</div>
      {application.text && <p className={styles.text}>{application.text}</p>}
      <div className={styles.actions}>
        {canEdit ? (
          <>
            <select
              className={styles.select}
              value={application.status}
              onChange={(e) =>
                onStatusChange(application.id, e.target.value as ApplicationStatus)
              }
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(application.id)}
            >
              Удалить
            </button>
          </>
        ) : (
          <span className={styles.status}>{application.status}</span>
        )}
      </div>
    </div>
  );
}