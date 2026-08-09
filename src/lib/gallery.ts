const API_URL = import.meta.env.VITE_API_URL as string;

export type Aspect = 'square' | 'tall' | 'wide';

export interface GalleryImage {
  id: number;
  image: string;
  label: string;
  aspect: Aspect;
  order: number;
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const res = await fetch(`${API_URL}/api/gallery/`);
  if (!res.ok) throw new Error('تعذّر تحميل معرض الصور');
  return res.json();
}
