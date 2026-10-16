import staticProjectsData from '../data/proyectos.json';

const configuredApiRoot = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const API_ROOT = configuredApiRoot || '/api';
export const PROJECTS_ENDPOINT = `${API_ROOT}/projects`;
export const EVENTS_ENDPOINT = `${API_ROOT}/events`;

export async function requestProjects() {
  try {
    const response = await fetch(PROJECTS_ENDPOINT, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`No se pudieron cargar los proyectos (${response.status})`);
    const payload = await response.json();
    return Array.isArray(payload) ? payload : (payload.value || []);
  } catch (error) {
    console.info('[Projects API] Modo estático activo: usando catálogo local embebido.');
    return Array.isArray(staticProjectsData) ? staticProjectsData : (staticProjectsData.value || []);
  }
}

export async function createProject(input) {
  return request(PROJECTS_ENDPOINT, { method: 'POST', body: JSON.stringify(input) });
}

export async function patchProject(identifier, input) {
  return request(`${PROJECTS_ENDPOINT}/${encodeURIComponent(identifier)}`, {
    method: 'PATCH', body: JSON.stringify(input),
  });
}

export async function setProjectFeatured(identifier, featured) {
  return request(`${PROJECTS_ENDPOINT}/${encodeURIComponent(identifier)}/featured`, {
    method: 'PATCH', body: JSON.stringify({ featured }),
  });
}

async function request(url, options) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Error HTTP ${response.status}`);
  return payload;
}

export function databaseAdminUrl() {
  if (import.meta.env.DEV && !configuredApiRoot) return 'http://127.0.0.1:3001/database';
  if (configuredApiRoot) return `${new URL(configuredApiRoot, window.location.origin).origin}/database`;
  return '/database';
}
