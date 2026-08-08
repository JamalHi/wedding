import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rose } from './Rose';
import { BookOpen, Gem, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { fetchSiteSettings, type SiteSettings } from '../lib/settings';

const MILESTONE_META = [
  { Icon: BookOpen, variant: 'bloom' as const },
  { Icon: Gem,       variant: 'side'  as const },
  { Icon: Sparkles,  variant: 'bud'   as const },
];

export default function StorySection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const storyMilestones = settings
    ? [1, 2, 3].map(i => ({
        year:        settings[`milestone${i}_date` as keyof SiteSettings],
        title:       settings[`milestone${i}_title` as keyof SiteSettings],
        description: settings[`milestone${i}_description` as keyof SiteSettings],
        ...MILESTONE_META[i - 1],
      }))
    : [];

  return (
    <section id="story" className="py-20 md:py-28 relative overflow-hidden" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(194,99,122,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="قصة حبّنا"
          title="كيف بدأت القصة"
          intro={settings?.story_intro ?? ''}
        />

        {/* الخط الزمني */}
        <div className="space-y-10 md:space-y-12 relative">
          {/* خط رأسي */}
          <div
            className="absolute right-1/2 top-0 bottom-0 w-px hidden md:block translate-x-1/2"
            style={{
              background:
                'linear-gradient(180deg, transparent, rgba(242,196,206,0.4), rgba(194,99,122,0.4), transparent)',
            }}
          />

          {storyMilestones.map((item, i) => (
            <motion.div
              key={i}
              className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {/* البطاقة */}
              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                <motion.div
                  className="inline-block glass p-7 md:p-8 max-w-sm tilt-3d"
                  dir="rtl"
                  style={{ borderRadius: '20px' }}
                  whileHover={{ y: -6 }}
                >
                  <div className="flex justify-center mb-3 md:mb-4">
                    <div className="relative" style={{ filter: 'drop-shadow(0 10px 20px rgba(194,99,122,0.3))' }}>
                      <Rose size={56} variant={item.variant} />
                    </div>
                  </div>
                  <p
                    className="text-xs sm:text-sm mb-1.5 md:mb-2"
                    style={{
                      fontFamily: 'Tajawal, sans-serif',
                      color: '#c2637a',
                      letterSpacing: '0.3em',
                    }}
                  >
                    {item.year}
                  </p>
                  <h3
                    className="text-xl sm:text-2xl mb-2 md:mb-3"
                    style={{
                      fontFamily: 'Amiri, serif',
                      color: '#f2c4ce',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base sm:text-lg leading-relaxed italic mt-1 md:mt-2"
                    style={{
                      fontFamily: 'Scheherazade New, serif',
                      color: 'rgba(255,245,247,0.75)',
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              </div>

              {/* النقطة الوسطى */}
              <motion.div
                className="relative z-10 hidden md:flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0"
                style={{
                  background: 'radial-gradient(circle, rgba(242,196,206,0.25), rgba(194,99,122,0.08))',
                  border: '2px solid rgba(242,196,206,0.4)',
                  boxShadow: '0 0 30px rgba(194,99,122,0.35), inset 0 0 15px rgba(242,196,206,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ scale: 1.15, rotate: 90 }}
                transition={{ duration: 0.4 }}
              >
                <item.Icon size={22} color="#f2c4ce" strokeWidth={1.5} />
              </motion.div>

              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>

        {/* اقتباس */}
        <motion.div
          className="text-center mt-14 md:mt-20 py-10 md:py-12 relative max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          dir="rtl"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(194,99,122,0.10), rgba(242,196,206,0.04))',
              border: '1px solid rgba(242,196,206,0.15)',
              borderRadius: '24px',
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* أوراق على الزوايا */}
    {/*
          <div className="absolute top-3 right-3"><Leaf size={32} rotate={-30} opacity={0.6} /></div>
          <div className="absolute bottom-3 left-3"><Leaf size={32} rotate={150} opacity={0.6} /></div>

          <p
            className="absolute top-2 sm:top-3 right-6 sm:right-10 text-5xl sm:text-6xl md:text-7xl pointer-events-none"
            style={{ fontFamily: 'Amiri, serif', color: 'rgba(242,196,206,0.15)' }}
          >
            ❝
          </p>
          <p
            className="text-2xl md:text-3xl relative px-10 sm:px-14 italic"
            style={{
              fontFamily: 'Scheherazade New, serif',
              color: 'rgba(255,245,247,0.9)',
              lineHeight: 2,
            }}
          >
              أنتِ يا من جعلتِ الأبد كلمةً تُشبه اسمكِ
          </p>
          <p
            className="absolute bottom-2 sm:bottom-3 left-6 sm:left-10 text-5xl sm:text-6xl md:text-7xl pointer-events-none"
            style={{ fontFamily: 'Amiri, serif', color: 'rgba(242,196,206,0.15)' }}
          >
            ❞
          </p>
          <div className="h-px w-16 mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, #c2637a, transparent)' }} />
          <p
            className="text-xs mt-4 relative"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              color: 'rgba(242,196,206,0.6)',
              letterSpacing: '0.3em',
            }}
          >
            — جمال و سوار
          </p>
    */}
        </motion.div>
      </div>
    </section>
  );
}
