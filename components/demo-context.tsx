'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initialState, type DemoState } from '@/lib/demo';

export type Role = 'client' | 'provider' | 'admin';
const STORAGE_KEY = 'vynto-demo-v1';
type DemoContextValue = {
  state: DemoState;
  update: (updater: (state: DemoState) => DemoState) => void;
  role: Role;
  setRole: (role: Role) => void;
  ready: boolean;
  selectedProviderId: string;
  setSelectedProviderId: (id: string) => void;
  reset: () => void;
  notice: string;
  notify: (message: string) => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [role, setRole] = useState<Role>('client');
  const [selectedProviderId, setSelectedProviderId] = useState('p01');
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.version === 1 && Array.isArray(data.state?.providers) && data.state.providers.length === 24 && Array.isArray(data.state.requests) && Array.isArray(data.state.transactions)) {
          setState({ ...data.state, providers: data.state.providers.map((p: { category: string }) => ({ ...p, color: `var(--color-category-${p.category})` })) });
          if (data.state.providers.some((p: { id: string }) => p.id === data.selectedProviderId)) setSelectedProviderId(data.selectedProviderId);
          if (['client', 'provider', 'admin'].includes(data.role)) setRole(data.role);
        }
      }
    } catch { /* A blocked or invalid local store falls back to the seed. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state, role, selectedProviderId })); }
      catch { setNotice('El navegador no permite guardar cambios. La demo funciona durante esta sesión.'); }
    }
  }, [state, role, ready, selectedProviderId]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  function reset() {
    setState(initialState());
    setSelectedProviderId('p01');
    setRole('client');
    setNotice('La demostración se ha restablecido.');
  }

  return <DemoContext.Provider value={{ state, update: setState, role, setRole, ready, selectedProviderId, setSelectedProviderId, reset, notice, notify: setNotice }}>
    {children}
    <div className={`toast ${notice ? 'visible' : ''}`} role="status" aria-live="polite">{notice}</div>
  </DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be inside DemoProvider');
  return context;
}
