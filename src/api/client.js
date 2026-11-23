/**
 * Thin fetch wrapper around the TaskFlow REST API.
 *
 * - Base URL comes from VITE_API_URL (see .env.example), defaulting to
 *   the backend's usual http://localhost:5000.
 * - The JWT is read from localStorage on every request and sent as
 *   `Authorization: Bearer <token>`, exactly as the backend expects.
 * - Non-2xx responses are turned into thrown Errors carrying the
 *   server's `{ error: "..." }` message so pages can display them.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('taskflow_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('taskflow_token', token);
  else localStorage.removeItem('taskflow_token');
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return null; // e.g. DELETE success

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ---- Auth -------------------------------------------------------------
export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),

  // ---- Tasks ----------------------------------------------------------
  listTasks: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return request(`/api/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (payload) => request('/api/tasks', { method: 'POST', body: payload }),
  updateTask: (id, payload) => request(`/api/tasks/${id}`, { method: 'PATCH', body: payload }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};
