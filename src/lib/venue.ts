const API_URL = import.meta.env.VITE_API_URL as string;

export interface Venue {
  hall_name:      string;
  tagline:        string;
  address:        string;
  phone:          string;
  website:        string;
  map_embed_url:  string;
  directions_url: string;
  stat1_value: string; stat1_label: string;
  stat2_value: string; stat2_label: string;
  stat3_value: string; stat3_label: string;
}

export async function fetchVenue(): Promise<Venue> {
  const res = await fetch(`${API_URL}/api/venue/`);
  if (!res.ok) throw new Error('تعذّر تحميل بيانات القاعة');
  return res.json();
}
