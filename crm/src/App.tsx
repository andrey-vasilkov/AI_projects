import { useState } from 'react';
import { useApplications } from './hooks/useApplications';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import type { ApplicationStatus } from './types';
import styles from './App.module.css';

const allStatuses: ApplicationStatus[] = ['Новая', 'В работе', 'Завершена'];

export default function App() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { applications, loading, addApplication, updateStatus, deleteApplication } =
    useApplications(search, statusFilter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Заявки</h1>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + Добавить заявку
        </button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Поиск по имени, контакту или тексту..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <p className={styles.loading}>Загрузка...</p>}

      <ApplicationList
        applications={applications}
        onStatusChange={updateStatus}
        onDelete={deleteApplication}
      />

      {showForm && (
        <ApplicationForm
          onSubmit={(name, contact, text) => {
            addApplication(name, contact, text);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}