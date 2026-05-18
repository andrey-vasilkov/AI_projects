import { useState, useCallback, useEffect, useRef } from 'react';
import type { Application, ApplicationStatus } from '../types';

const API = '/api/applications';

function headers(token?: string | null): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export function useApplications(
  search: string,
  statusFilter: string,
  token?: string | null,
  onNotify?: (msg: string, type?: 'error' | 'success') => void,
) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchId = useRef(0);

  const fetchApps = useCallback(async () => {
    const id = ++fetchId.current;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    try {
      const res = await fetch(`${API}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (id === fetchId.current) {
        setApplications(data);
        setLoading(false);
      }
    } catch {
      if (id === fetchId.current) {
        setLoading(false);
        onNotify?.('Не удалось загрузить заявки', 'error');
      }
    }
  }, [search, statusFilter, onNotify]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const addApplication = useCallback(
    async (clientName: string, contact: string, text: string) => {
      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: headers(token),
          body: JSON.stringify({ clientName, contact, text }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const created = await res.json();
        setApplications((prev) => [created, ...prev]);
        onNotify?.('Заявка добавлена', 'success');
      } catch {
        onNotify?.('Не удалось добавить заявку', 'error');
      }
    },
    [token, onNotify],
  );

  const updateStatus = useCallback(
    async (id: string, status: ApplicationStatus) => {
      try {
        const res = await fetch(`${API}/${id}/status`, {
          method: 'PATCH',
          headers: headers(token),
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app)),
        );
      } catch {
        onNotify?.('Не удалось изменить статус', 'error');
      }
    },
    [token, onNotify],
  );

  const deleteApplication = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: headers(token) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch {
      onNotify?.('Не удалось удалить заявку', 'error');
    }
  }, [token, onNotify]);

  return { applications, loading, addApplication, updateStatus, deleteApplication };
}