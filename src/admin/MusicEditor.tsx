import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music2 } from 'lucide-react';
import { AuthError, fetchMusicAdmin, uploadMusic, type SiteMusic } from './api';

const INK       = 'var(--cream)';
const INK_MUTED = 'var(--muted)';

export default function MusicEditor({ onAuthError }: { onAuthError: () => void }) {
  const [music,   setMusic]   = useState<SiteMusic | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [file,      setFile]      = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setMusic(await fetchMusicAdmin());
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر تحميل ملف الموسيقى');
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
      setMusic(await uploadMusic(file));
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر رفع الملف');
    } finally {
      setUploading(false);
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
          الموسيقى الحالية
        </h2>
        {music?.audio_file ? (
          <audio controls src={music.audio_file} className="w-full" style={{ borderRadius: '10px' }} />
        ) : (
          <div className="flex items-center gap-3" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>
            <Music2 size={18} />
            <span>لا يوجد ملف مرفوع — سيُستخدم الملف الافتراضي بالموقع</span>
          </div>
        )}
      </div>

      <div
        className="p-7 space-y-5"
        style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}
      >
        <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, letterSpacing: '0.1em' }}>
          استبدال الملف
        </h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="rsvp-input w-full max-w-md px-3 py-2 text-sm"
          style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
        />
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
          {uploading ? 'جارٍ الرفع...' : 'رفع الملف'}
        </motion.button>
      </div>

      {errorMsg && (
        <p className="text-sm text-center" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{errorMsg}</p>
      )}
    </div>
  );
}
