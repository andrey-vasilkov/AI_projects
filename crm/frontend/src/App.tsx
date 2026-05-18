import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useApplications } from './hooks/useApplications';
import { useToast } from './hooks/useToast';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import LoginForm from './components/LoginForm';
import ToastContainer from './components/ToastContainer';
import type { ApplicationStatus } from './types';
import styles from './App.module.css';

const allStatuses: ApplicationStatus[] = ['Новая', 'В работе', 'Завершена'];

export default function App() {
  const { token, login, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { toasts, addToast } = useToast();

  const { applications, loading, addApplication, updateStatus, deleteApplication } =
    useApplications(search, statusFilter, token, addToast);

  const isAuthed = !!token;

  return (
    <div className={styles.container}>
      <ToastContainer toasts={toasts} />
      <div className={styles.header}>
        <h1 className={styles.title}>Заявки</h1>
        <div className={styles.actions}>
          {isAuthed ? (
            <>
              <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                + Добавить заявку
              </button>
              <button className={styles.logoutBtn} onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <button className={styles.loginBtn} onClick={() => setShowLogin(true)}>
              Войти
            </button>
          )}
        </div>
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
        canEdit={isAuthed}
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

      {showLogin && (
        <LoginForm
          onLogin={login}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}