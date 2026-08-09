import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import {
  AuthError, fetchGalleryAdmin, uploadGalleryImage, updateGalleryImage, deleteGalleryImage,
  type GalleryImage,
} from './api';

const API_URL = import.meta.env.VITE_API_URL as string;

const INK       = 'var(--cream)';
const INK_MUTED = 'var(--muted)';

const ASPECT_OPTIONS: { value: GalleryImage['aspect']; label: string }[] = [
  { value: 'square', label: 'مربّع' },
  { value: 'tall',   label: 'طويل' },
  { value: 'wide',   label: 'عريض' },
];

function imageUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path}`;
}

export default function GalleryEditor({ onAuthError }: { onAuthError: () => void }) {
  const [images,   setImages]   = useState<GalleryImage[] | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [file,      setFile]      = useState<File | null>(null);
  const [label,     setLabel]     = useState('');
  const [aspect,    setAspect]    = useState<GalleryImage['aspect']>('square');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setImages(await fetchGalleryAdmin());
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر تحميل الصور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    try {
      await uploadGalleryImage(file, label, aspect);
      setFile(null);
      setLabel('');
      setAspect('square');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await load();
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف هذه الصورة نهائياً؟')) return;
    try {
      await deleteGalleryImage(id);
      setImages(prev => prev?.filter(img => img.id !== id) ?? null);
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر حذف الصورة');
    }
  };

  const handleLabelChange = (id: number, value: string) => {
    setImages(prev => prev?.map(img => (img.id === id ? { ...img, label: value } : img)) ?? null);
  };

  const handleLabelSave = (id: number, value: string) => {
    updateGalleryImage(id, { label: value }).catch(err => {
      if (err instanceof AuthError) onAuthError();
      else setErrorMsg('تعذّر حفظ التسمية');
    });
  };

  const handleAspectChange = (id: number, value: GalleryImage['aspect']) => {
    setImages(prev => prev?.map(img => (img.id === id ? { ...img, aspect: value } : img)) ?? null);
    updateGalleryImage(id, { aspect: value }).catch(err => {
      if (err instanceof AuthError) onAuthError();
      else setErrorMsg('تعذّر حفظ الشكل');
    });
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!images) return;
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const a = images[index];
    const b = images[target];
    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setImages(reordered);

    try {
      await Promise.all([
        updateGalleryImage(a.id, { order: b.order }),
        updateGalleryImage(b.id, { order: a.order }),
      ]);
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر تغيير الترتيب');
    }
  };

  if (loading) {
    return <p className="text-center py-16" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>جارٍ التحميل...</p>;
  }

  return (
    <div className="space-y-8">
      <div
        className="p-7 space-y-5"
        style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}
      >
        <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, letterSpacing: '0.1em' }}>
          إضافة صورة جديدة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <label className="space-y-2 block md:col-span-2">
            <span className="text-xs block" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>الملف</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="rsvp-input w-full px-3 py-2 text-sm"
              style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
            />
          </label>
          <label className="space-y-2 block">
            <span className="text-xs block" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>التسمية</span>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="rsvp-input w-full px-4 py-2.5 text-sm"
              style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
            />
          </label>
          <label className="space-y-2 block">
            <span className="text-xs block" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>الشكل</span>
            <select
              value={aspect}
              onChange={e => setAspect(e.target.value as GalleryImage['aspect'])}
              className="rsvp-input w-full px-4 py-2.5 text-sm"
              style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
            >
              {ASPECT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <motion.button
          onClick={handleUpload}
          disabled={!file || uploading}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-2 px-6 py-3 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
            color: '#fff5f7',
            border: 'none',
            fontFamily: 'Tajawal, sans-serif',
            letterSpacing: '0.08em',
            borderRadius: '999px',
            opacity: !file || uploading ? 0.6 : 1,
          }}
        >
          <Upload size={16} />
          {uploading ? 'جارٍ الرفع...' : 'رفع الصورة'}
        </motion.button>
      </div>

      {errorMsg && (
        <p className="text-sm text-center" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{errorMsg}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images?.map((img, i) => (
          <div
            key={img.id}
            className="overflow-hidden"
            style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '16px' }}
          >
            <div className="relative" style={{ paddingTop: '65%' }}>
              <img
                src={imageUrl(img.image)}
                alt={img.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-3">
              <input
                value={img.label}
                onChange={e => handleLabelChange(img.id, e.target.value)}
                onBlur={e => handleLabelSave(img.id, e.target.value)}
                placeholder="التسمية"
                className="rsvp-input w-full px-3 py-2 text-sm"
                style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={img.aspect}
                  onChange={e => handleAspectChange(img.id, e.target.value as GalleryImage['aspect'])}
                  className="rsvp-input px-3 py-2 text-sm"
                  style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
                >
                  {ASPECT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ border: '1px solid rgba(242,196,206,0.2)', color: INK, opacity: i === 0 ? 0.3 : 1 }}
                    aria-label="تحريك للأعلى"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ border: '1px solid rgba(242,196,206,0.2)', color: INK, opacity: i === images.length - 1 ? 0.3 : 1 }}
                    aria-label="تحريك للأسفل"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ border: '1px solid rgba(208,59,59,0.35)', color: '#e88a8a' }}
                    aria-label="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images && images.length === 0 && (
        <p className="text-center py-10 text-sm" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>
          لا توجد صور بعد — ابدأ برفع أول صورة
        </p>
      )}
    </div>
  );
}
