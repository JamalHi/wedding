import { useState } from 'react';
import { Users, Building2, Settings2, Images, Music2, LogOut } from 'lucide-react';
import { Monogram } from '../components/Rose';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import VenueEditor from './VenueEditor';
import SiteSettingsEditor from './SiteSettingsEditor';
import GalleryEditor from './GalleryEditor';
import MusicEditor from './MusicEditor';
import { getAccessToken, clearTokens } from './api';

const TABS = [
  { key: 'guests',   label: 'الردود',            icon: Users },
  { key: 'venue',    label: 'معلومات القاعة',    icon: Building2 },
  { key: 'settings', label: 'معلومات عامة',      icon: Settings2 },
  { key: 'gallery',  label: 'الصور',              icon: Images },
  { key: 'music',    label: 'الموسيقى',           icon: Music2 },
] as const;
type Tab = (typeof TABS)[number]['key'];

const PANELS: Record<Exclude<Tab, 'guests'>, { title: string; subtitle: string; Component: typeof VenueEditor }> = {
  venue: {
    title: 'معلومات القاعة',
    subtitle: 'التعديلات هنا تنعكس مباشرة على صفحة "أين نحتفل" بالموقع الرئيسي',
    Component: VenueEditor,
  },
  settings: {
    title: 'معلومات عامة',
    subtitle: 'أسماء العروسين، تاريخ الحفل، قصتنا، وبرنامج الحفل — تنعكس على كل صفحات الموقع',
    Component: SiteSettingsEditor,
  },
  gallery: {
    title: 'معرض الصور',
    subtitle: 'الصور المرفوعة هنا تظهر مباشرة في قسم "معرض الصور" بالموقع الرئيسي',
    Component: GalleryEditor,
  },
  music: {
    title: 'الموسيقى',
    subtitle: 'الملف المرفوع هنا يحلّ محلّ موسيقى الخلفية الافتراضية بالموقع',
    Component: MusicEditor,
  },
};

const INK       = 'var(--cream)';
const INK_MUTED = 'var(--muted)';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => !!getAccessToken());
  const [tab,    setTab]    = useState<Tab>('guests');

  const handleAuthError = () => {
    clearTokens();
    setAuthed(false);
  };

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div dir="rtl" className="min-h-screen flex" style={{ background: 'var(--noir)' }}>
      {/* الشريط الجانبي */}
      <aside
        className="w-60 shrink-0 min-h-screen flex flex-col px-4 py-6 sticky top-0"
        style={{
          background: 'var(--noir-card)',
          borderLeft: '1px solid rgba(242,196,206,0.15)',
        }}
      >
        <div className="flex items-center gap-3 px-2 mb-8">
          <Monogram size={38} />
          <span className="text-sm" style={{ fontFamily: 'Amiri, serif', color: INK }}>لوحة التحكم</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors text-right"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                borderRadius: '12px',
                background: tab === t.key ? 'linear-gradient(135deg, #c2637a, #7b3a4c)' : 'transparent',
                color: tab === t.key ? '#fff5f7' : INK_MUTED,
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleAuthError}
          className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer"
          style={{
            fontFamily: 'Tajawal, sans-serif',
            borderRadius: '12px',
            border: '1px solid rgba(242,196,206,0.2)',
            color: INK,
          }}
        >
          <LogOut size={16} /> خروج
        </button>
      </aside>

      {/* المحتوى */}
      <div className="flex-1 min-w-0">
        {tab === 'guests' && <Dashboard onAuthError={handleAuthError} />}

        {tab !== 'guests' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-10">
            <div className="space-y-2 mb-8">
              <h1 className="text-2xl md:text-3xl" style={{ fontFamily: 'Amiri, serif', color: INK }}>{PANELS[tab].title}</h1>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>{PANELS[tab].subtitle}</p>
            </div>
            {(() => {
              const { Component } = PANELS[tab];
              return <Component onAuthError={handleAuthError} />;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
