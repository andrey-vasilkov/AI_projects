import type { Toast } from '../hooks/useToast';
import styles from './ToastContainer.module.css';

interface Props {
  toasts: Toast[];
}

export default function ToastContainer({ toasts }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
