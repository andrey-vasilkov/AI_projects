import { useState, useCallback, useEffect, useRef } from 'react';
import type { Application, ApplicationStatus } from '../types';

const API = '/api/applications';

export function useApplications(search: string, statusFilter: string) {
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
      if (id === fetchId.current) setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const addApplication = useCallback(
    async (clientName: string, contact: string, text: string) => {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, contact, text }),
      });
      const created = await res.json();
      setApplications((prev) => [created, ...prev]);
    },
    [],
  );

  const updateStatus = useCallback(
    async (id: string, status: ApplicationStatus) => {
      await fetch(`${API}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
    },
    [],
  );

  const deleteApplication = useCallback(async (id: string) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  return { applications, loading, addApplication, updateStatus, deleteApplication };
}