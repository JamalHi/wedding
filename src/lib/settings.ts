const API_URL = import.meta.env.VITE_API_URL as string;

export interface SiteSettings {
  groom_name: string;
  bride_name: string;

  wedding_datetime: string;
  hero_date_line: string;
  hero_year_line: string;
  ceremony_time_range: string;
  doors_open_note: string;

  story_intro: string;
  milestone1_date: string; milestone1_title: string; milestone1_description: string;
  milestone2_date: string; milestone2_title: string; milestone2_description: string;
  milestone3_date: string; milestone3_title: string; milestone3_description: string;

  program1_time: string; program1_title: string; program1_description: string;
  program2_time: string; program2_title: string; program2_description: string;
  program3_time: string; program3_title: string; program3_description: string;
  program4_time: string; program4_title: string; program4_description: string;

  footer_quote: string;
  hashtag: string;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/api/settings/`);
  if (!res.ok) throw new Error('تعذّر تحميل إعدادات الموقع');
  return res.json();
}
