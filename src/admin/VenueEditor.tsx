import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Check } from 'lucide-react';
import { AuthError, fetchVenueAdmin, updateVenue, type Venue } from './api';

const INK       = 'var(--cream)';
const INK_MUTED = 'var(--muted)';

const FIELD_GROUPS: { title: string; fields: { key: keyof Venue; label: string; multiline?: boolean }[] }[] = [
  {
    title: 'الهوية',
    fields: [
      { key: 'hall_name', label: 'اسم القاعة' },
      { key: 'tagline',   label: 'الوصف المختصر' },
    ],
  },
  {
    title: 'معلومات التواصل',
    fields: [
      { key: 'address', label: 'العنوان' },
      { key: 'phone',   label: 'الهاتف' },
      { key: 'website', label: 'الموقع الإلكتروني' },
    ],
  },
  {
    title: 'الخريطة',
    fields: [
      { key: 'map_embed_url',  label: 'رابط تضمين خرائط جوجل (Embed URL)', multiline: true },
      { key: 'directions_url', label: 'رابط الاتجاهات' },
    ],
  },
  {
    title: 'الإحصاءات المعروضة',
    fields: [
      { key: 'stat1_value', label: 'رقم 1' }, { key: 'stat1_label', label: 'وصف 1' },
      { key: 'stat2_value', label: 'رقم 2' }, { key: 'stat2_label', label: 'وصف 2' },
      { key: 'stat3_value', label: 'رقم 3' }, { key: 'stat3_label', label: 'وصف 3' },
    ],
  },
];

export default function VenueEditor({ onAuthError }: { onAuthError: () => void }) {
  const [venue,    setVenue]    = useState<Venue | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setVenue(await fetchVenueAdmin());
      } catch (err) {
        if (err instanceof AuthError) { onAuthError(); return; }
        setErrorMsg('تعذّر تحميل بيانات القاعة');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key: keyof Venue, value: string) => {
    setVenue(v => (v ? { ...v, [key]: value } : v));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!venue) return;
    setSaving(true);
    setErrorMsg('');
    try {
      const updated = await updateVenue(venue);
      setVenue(updated);
      setSaved(true);
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر حفظ التعديلات، حاول مرة أخرى');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center py-16" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>جارٍ التحميل...</p>;
  }

  if (!venue) {
    return <p className="text-center py-16" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{errorMsg}</p>;
  }

  return (
    <div className="space-y-8">
      {FIELD_GROUPS.map(group => (
        <div
          key={group.title}
          className="p-7 space-y-5"
          style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}
        >
          <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, letterSpacing: '0.1em' }}>
            {group.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {group.fields.map(field => (
              <label key={field.key} className={`space-y-2 block ${field.multiline ? 'md:col-span-2' : ''}`}>
                <span className="text-xs block" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>
                  {field.label}
                </span>
                {field.multiline ? (
                  <textarea
                    value={venue[field.key]}
                    onChange={e => setField(field.key, e.target.value)}
                    rows={3}
                    className="rsvp-input w-full px-4 py-2.5 text-sm"
                    style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px', direction: 'ltr', resize: 'vertical' }}
                  />
                ) : (
                  <input
                    value={venue[field.key]}
                    onChange={e => setField(field.key, e.target.value)}
                    className="rsvp-input w-full px-4 py-2.5 text-sm"
                    style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      {errorMsg && (
        <p className="text-sm text-center" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{errorMsg}</p>
      )}

      <div className="flex items-center gap-4">
        <motion.button
          onClick={handleSave}
          disabled={saving}
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
            boxShadow: '0 15px 35px -10px rgba(194,99,122,0.7)',
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Save size={16} />
          {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
        </motion.button>

        {saved && !saving && (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: '#0ca30c', fontFamily: 'Tajawal, sans-serif' }}>
            <Check size={15} /> تم الحفظ
          </span>
        )}
      </div>
    </div>
  );
}
