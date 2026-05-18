import type { Application, ApplicationStatus } from '../types';
import ApplicationCard from './ApplicationCard';
import styles from './ApplicationList.module.css';

interface Props {
  applications: Application[];
  canEdit: boolean;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationList({
  applications,
  canEdit,
  onStatusChange,
  onDelete,
}: Props) {
  if (applications.length === 0) {
    return <p className={styles.empty}>Пока нет заявок. Нажмите «Добавить заявку», чтобы создать первую.</p>;
  }

  return (
    <div className={styles.list}>
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          canEdit={canEdit}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}