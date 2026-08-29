import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Check } from 'lucide-react';
import { AuthError, fetchSettingsAdmin, updateSettings, type SiteSettings } from './api';

const INK_MUTED = 'var(--muted)';

const FIELD_GROUPS: { title: string; fields: { key: keyof SiteSettings; label: string; multiline?: boolean }[] }[] = [
  {
    title: 'الأسماء',
    fields: [
      { key: 'groom_name', label: 'اسم العريس' },
      { key: 'bride_name', label: 'اسم العروس' },
      { key: 'groom_father_name', label: 'اسم والد العريس' },
      { key: 'bride_father_name', label: 'اسم والد العروس' },
    ],
  },
  {
    title: 'البطاقة الرئيسية',
    fields: [
      { key: 'hero_quran_verse', label: 'الآية القرآنية', multiline: true },
      { key: 'hero_quran_reference', label: 'مرجع الآية (السورة والرقم)' },
    ],
  },
  {
    title: 'التاريخ والوقت',
    fields: [
      { key: 'hero_date_line',      label: 'سطر التاريخ بالصفحة الرئيسية' },
      { key: 'hero_year_line',      label: 'سطر السنة بالصفحة الرئيسية' },
      { key: 'ceremony_time_range', label: 'توقيت الحفل' },
      { key: 'doors_open_note',     label: 'ملاحظة فتح الأبواب' },
    ],
  },
  {
    title: 'قصتنا',
    fields: [
      { key: 'story_intro', label: 'مقدّمة القسم' },
      { key: 'milestone1_date', label: 'تاريخ المرحلة 1' }, { key: 'milestone1_title', label: 'عنوان المرحلة 1' },
      { key: 'milestone1_description', label: 'وصف المرحلة 1', multiline: true },
      { key: 'milestone2_date', label: 'تاريخ المرحلة 2' }, { key: 'milestone2_title', label: 'عنوان المرحلة 2' },
      { key: 'milestone2_description', label: 'وصف المرحلة 2', multiline: true },
      { key: 'milestone3_date', label: 'تاريخ المرحلة 3' }, { key: 'milestone3_title', label: 'عنوان المرحلة 3' },
      { key: 'milestone3_description', label: 'وصف المرحلة 3', multiline: true },
    ],
  },
  {
    title: 'برنامج الحفل',
    fields: [
      { key: 'program1_time', label: 'توقيت 1' }, { key: 'program1_title', label: 'عنوان 1' }, { key: 'program1_description', label: 'وصف 1' },
      { key: 'program2_time', label: 'توقيت 2' }, { key: 'program2_title', label: 'عنوان 2' }, { key: 'program2_description', label: 'وصف 2' },
      { key: 'program3_time', label: 'توقيت 3' }, { key: 'program3_title', label: 'عنوان 3' }, { key: 'program3_description', label: 'وصف 3' },
      { key: 'program4_time', label: 'توقيت 4' }, { key: 'program4_title', label: 'عنوان 4' }, { key: 'program4_description', label: 'وصف 4' },
    ],
  },
  {
    title: 'التذييل',
    fields: [
      { key: 'footer_quote', label: 'اقتباس التذييل', multiline: true },
      { key: 'hashtag',      label: 'الهاشتاغ' },
    ],
  },
];

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SiteSettingsEditor({ onAuthError }: { onAuthError: () => void }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setSettings(await fetchSettingsAdmin());
      } catch (err) {
        if (err instanceof AuthError) { onAuthError(); return; }
        setErrorMsg('تعذّر تحميل الإعدادات');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key: keyof SiteSettings, value: string) => {
    setSettings(s => (s ? { ...s, [key]: value } : s));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setErrorMsg('');
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
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

  if (!settings) {
    return <p className="text-center py-16" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{errorMsg}</p>;
  }

  return (
    <div className="space-y-8">
      <div
        className="p-7 space-y-5"
        style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}
      >
        <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, letterSpacing: '0.1em' }}>
          موعد الزفاف الدقيق (للعدّ التنازلي)
        </h2>
        <label className="space-y-2 block max-w-xs">
          <input
            type="datetime-local"
            value={toDatetimeLocal(settings.wedding_datetime)}
            onChange={e => setField('wedding_datetime', new Date(e.target.value).toISOString())}
            className="rsvp-input w-full px-4 py-2.5 text-sm"
            style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px', direction: 'ltr' }}
          />
        </label>
      </div>

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
                    value={settings[field.key]}
                    onChange={e => setField(field.key, e.target.value)}
                    rows={3}
                    className="rsvp-input w-full px-4 py-2.5 text-sm"
                    style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px', resize: 'vertical' }}
                  />
                ) : (
                  <input
                    value={settings[field.key]}
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
