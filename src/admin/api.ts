import type { Venue } from '../lib/venue';
import type { SiteSettings } from '../lib/settings';
import type { GalleryImage } from '../lib/gallery';
import type { SiteMusic } from '../lib/music';

const API_URL = import.meta.env.VITE_API_URL as string;

const ACCESS_KEY  = 'admin_access';
const REFRESH_KEY = 'admin_refresh';

export type { Venue, SiteSettings, GalleryImage, SiteMusic };

export type Attendance = 'yes' | 'no' | 'maybe';

export interface Guest {
  id:         number;
  name:       string;
  email:      string;
  phone:      string;
  attendance: Attendance;
  guests:     number;
  dietary:    string;
  message:    string;
  created_at: string;
}

export interface Stats {
  total_responses:  number;
  counts:           Record<Attendance, number>;
  total_attendees:  number;
  dietary_requirements: { name: string; dietary: string }[];
  timeline:         { date: string; count: number }[];
}

export class AuthError extends Error {}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers ?? {}) },
  });
  if (res.status === 401) {
    clearTokens();
    throw new AuthError('انتهت صلاحية الجلسة');
  }
  if (!res.ok) throw new Error('تعذّر تنفيذ الطلب');
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('بيانات الدخول غير صحيحة');
  const data = await res.json();
  setTokens(data.access, data.refresh);
}

export const fetchStats  = () => apiFetch<Stats>('/api/stats/');
export const fetchGuests = () => apiFetch<Guest[]>('/api/guests/');
export const resetGuests = () => apiFetch<{ deleted: number }>('/api/guests/reset/', { method: 'POST' });

export const fetchVenueAdmin = () => apiFetch<Venue>('/api/venue/');
export const updateVenue = (data: Venue) =>
  apiFetch<Venue>('/api/venue/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const fetchSettingsAdmin = () => apiFetch<SiteSettings>('/api/settings/');
export const updateSettings = (data: SiteSettings) =>
  apiFetch<SiteSettings>('/api/settings/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const fetchGalleryAdmin = () => apiFetch<GalleryImage[]>('/api/gallery/');

export const uploadGalleryImage = (file: File, label: string, aspect: string) => {
  const form = new FormData();
  form.append('image', file);
  form.append('label', label);
  form.append('aspect', aspect);
  return apiFetch<GalleryImage>('/api/gallery/', { method: 'POST', body: form });
};

export const updateGalleryImage = (id: number, data: Partial<Pick<GalleryImage, 'label' | 'aspect' | 'order'>>) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => form.append(key, String(value)));
  return apiFetch<GalleryImage>(`/api/gallery/${id}/`, { method: 'PATCH', body: form });
};

export const deleteGalleryImage = (id: number) =>
  apiFetch<void>(`/api/gallery/${id}/`, { method: 'DELETE' });

export const fetchMusicAdmin = () => apiFetch<SiteMusic>('/api/music/');
export const uploadMusic = (file: File) => {
  const form = new FormData();
  form.append('audio_file', file);
  return apiFetch<SiteMusic>('/api/music/', { method: 'PATCH', body: form });
};
export const deleteMusic = () => apiFetch<SiteMusic>('/api/music/', { method: 'DELETE' });
