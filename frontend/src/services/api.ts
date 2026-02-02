import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Automatically attach JWT to every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Health check (public)
export async function getHealth() {
  const res = await api.get('/health');
  return res.data;
}

//Auth APIs

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { token }
}

export async function signup(email: string, password: string) {
  const res = await api.post('/auth/signup', { email, password });
  return res.data;
}

// Protected user info
export async function me() {
  const res = await api.get('/me');
  return res.data;
}
