import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Monogram, HeartRose } from './Rose';
import { fetchSiteSettings, type SiteSettings } from '../lib/settings';
import { formatDateShort } from '../lib/date';

const navLinks = [
  { href: '#story',   label: 'قصتنا'     },
  { href: '#details', label: 'التفاصيل' },
  { href: '#gallery', label: 'الصور'     },
  { href: '#venue',   label: 'المكان'    },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings,   setSettings]   = useState<SiteSettings | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        dir="rtl"
        className="fixed top-3 inset-x-3 md:top-4 md:inset-x-6 z-40 flex items-center justify-between px-5 md:px-8 py-3 md:py-4 transition-all duration-500"
        style={{
          background:    scrolled ? 'rgba(24,13,16,0.85)' : 'rgba(24,13,16,0.4)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border:        '1px solid rgba(242,196,206,0.15)',
          borderRadius:  '999px',
          boxShadow:     scrolled
            ? '0 10px 40px rgba(24,13,16,0.5), 0 0 30px rgba(194,99,122,0.12)'
            : '0 4px 20px rgba(24,13,16,0.25)',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* الشعار */}
        <div className="flex items-center gap-3">
          <Monogram
            size={42}
            letter1={settings?.groom_name?.[0]}
            letter2={settings?.bride_name?.[0]}
          />
          <div className="h-5 w-px hidden md:block" style={{ background: 'rgba(242,196,206,0.3)' }} />
          {settings && (
            <span
              className="hidden md:block text-sm"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                color: 'rgba(242,196,206,0.7)',
                letterSpacing: '0.1em',
              }}
            >
              {formatDateShort(settings.wedding_datetime)}
            </span>
          )}
        </div>

        {/* روابط سطح المكتب */}
        <div className="hidden md:flex items-center gap-7" dir="rtl">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="relative group transition-colors duration-300 cursor-pointer"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                color: 'rgba(242,196,206,0.75)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,196,206,0.75)')}
            >
              {link.label}
              <span
                className="absolute -bottom-1 right-1/2 translate-x-1/2 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ background: 'linear-gradient(90deg, transparent, #f2c4ce, transparent)' }}
              />
            </button>
          ))}
          <button
            onClick={() => scrollTo('#rsvp')}
            className="px-5 py-2 cursor-pointer flex items-center gap-2 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
              color: '#fff5f7',
              borderRadius: '999px',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              boxShadow: '0 8px 20px -8px rgba(194,99,122,0.7), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 14px 30px -8px rgba(242,196,206,0.6), inset 0 1px 0 rgba(255,255,255,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(194,99,122,0.7), inset 0 1px 0 rgba(255,255,255,0.18)';
            }}
          >
            <HeartRose size={14} />
            تأكيد الحضور
          </button>
        </div>

        {/* زر الموبايل */}
        <button
          className="md:hidden p-3 cursor-pointer rounded-full"
          onClick={() => setMobileOpen(p => !p)}
          aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          style={{ color: '#f2c4ce' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* قائمة الموبايل */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            dir="rtl"
            className="fixed inset-0 z-30 flex flex-col items-center justify-center md:hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(194,99,122,0.25), rgba(24,13,16,0.98))',
              backdropFilter: 'blur(28px)',
            }}
            initial={{ opacity: 0, clipPath: 'circle(0% at 95% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 95% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 95% 5%)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Monogram
                  size={70}
                  letter1={settings?.groom_name?.[0]}
                  letter2={settings?.bride_name?.[0]}
                />
              </motion.div>

              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="cursor-pointer"
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '1.15rem',
                    letterSpacing: '0.15em',
                    color: '#f2c4ce',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                onClick={() => scrollTo('#rsvp')}
                className="px-6 py-3 cursor-pointer flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
                  color: '#fff5f7',
                  borderRadius: '999px',
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  boxShadow: '0 8px 20px -8px rgba(194,99,122,0.7), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + navLinks.length * 0.08 }}
              >
                <HeartRose size={16} />
                تأكيد الحضور
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
