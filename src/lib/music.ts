const API_URL = import.meta.env.VITE_API_URL as string;

export interface SiteMusic {
  audio_file: string | null;
}

export async function fetchSiteMusic(): Promise<SiteMusic> {
  const res = await fetch(`${API_URL}/api/music/`);
  if (!res.ok) throw new Error('تعذّر تحميل ملف الموسيقى');
  return res.json();
}
