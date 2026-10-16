import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EVENTS_ENDPOINT, requestProjects } from '../services/projectsApi';

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const mounted = useRef(true);

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const freshProjects = await requestProjects();
      if (!mounted.current) return;
      setProjects(freshProjects);
      setApiAvailable(true);
      setLastUpdatedAt(new Date().toISOString());
    } catch (error) {
      if (!mounted.current) return;
      setApiAvailable(false);
      console.warn('[Projects] API SQLite no disponible.', error);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const interval = window.setInterval(() => refresh({ silent: true }), 15000);
    const onFocus = () => refresh({ silent: true });
    window.addEventListener('focus', onFocus);

    let events;
    if (typeof EventSource !== 'undefined') {
      events = new EventSource(EVENTS_ENDPOINT);
      events.addEventListener('data-change', (event) => {
        try {
          if (JSON.parse(event.data).entity === 'projects') refresh({ silent: true });
        } catch { /* Ignorar eventos incompletos. */ }
      });
    }

    return () => {
      mounted.current = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      events?.close();
    };
  }, [refresh]);

  const value = useMemo(() => ({
    projects, loading, apiAvailable, lastUpdatedAt, refresh,
  }), [projects, loading, apiAvailable, lastUpdatedAt, refresh]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjectsData() {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error('useProjectsData debe utilizarse dentro de ProjectsProvider');
  return context;
}
