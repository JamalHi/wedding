import { useState } from 'react';
import { Users, Building2, Settings2 } from 'lucide-react';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import VenueEditor from './VenueEditor';
import SiteSettingsEditor from './SiteSettingsEditor';
import { getAccessToken, clearTokens } from './api';

const TABS = [
  { key: 'guests',   label: 'الردود',            icon: Users },
  { key: 'venue',    label: 'معلومات القاعة',    icon: Building2 },
  { key: 'settings', label: 'معلومات عامة',      icon: Settings2 },
] as const;
type Tab = (typeof TABS)[number]['key'];

const PANELS: Record<Exclude<Tab, 'guests'>, { title: string; subtitle: string }> = {
  venue: {
    title: 'معلومات القاعة',
    subtitle: 'التعديلات هنا تنعكس مباشرة على صفحة "أين نحتفل" بالموقع الرئيسي',
  },
  settings: {
    title: 'معلومات عامة',
    subtitle: 'أسماء العروسين، تاريخ الحفل، قصتنا، وبرنامج الحفل — تنعكس على كل صفحات الموقع',
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
    <div dir="rtl" className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at 20% 0%, rgba(194,99,122,0.14), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(242,196,206,0.08), transparent 55%), var(--noir)',
    }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 md:pt-10">
        <div className="flex items-center gap-2 p-1.5 w-fit flex-wrap" style={{ background: 'rgba(242,196,206,0.06)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '999px' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                borderRadius: '999px',
                background: tab === t.key ? 'linear-gradient(135deg, #c2637a, #7b3a4c)' : 'transparent',
                color: tab === t.key ? '#fff5f7' : INK_MUTED,
              }}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'guests' && <Dashboard onAuthError={handleAuthError} />}

      {tab !== 'guests' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-10">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl md:text-3xl" style={{ fontFamily: 'Amiri, serif', color: INK }}>{PANELS[tab].title}</h1>
            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>{PANELS[tab].subtitle}</p>
          </div>
          {tab === 'venue' ? (
            <VenueEditor onAuthError={handleAuthError} />
          ) : (
            <SiteSettingsEditor onAuthError={handleAuthError} />
          )}
        </div>
      )}
    </div>
  );
}
