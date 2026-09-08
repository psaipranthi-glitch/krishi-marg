import axios from 'axios';

export const API = import.meta.env.VITE_API_URL ?? (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000');
export const api = axios.create({ baseURL: API });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem('km_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
