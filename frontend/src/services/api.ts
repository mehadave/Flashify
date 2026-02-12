import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
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

// Location APIs
export type LocationPayload = {
  label: string;
  lat?: number;
  lng?: number;
};

export async function selectLocation(payload: LocationPayload) {
  const res = await api.post("/location/select", payload);
  return res.data; // { message, location }
}

// Address APIs
export type AddressPayload = {
  label: "Home" | "Work" | "Other" | string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  is_default?: boolean;
};

export type Address = AddressPayload & {
  id: number;
  is_default: boolean;
  created_at?: string;
};

export async function getAddresses() {
  const res = await api.get("/addresses");
  return res.data as Address[];
}

export async function createAddress(payload: AddressPayload) {
  const res = await api.post("/addresses", payload);
  return res.data as Address;
}

export async function setDefaultAddress(addressId: number) {
  const res = await api.patch(`/addresses/${addressId}/default`);
  return res.data; // { message }
}

export async function deleteAddress(addressId: number) {
  const res = await api.delete(`/addresses/${addressId}`);
  return res.data; // { message }
}
