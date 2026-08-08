import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rose, HeartRose } from './Rose';
import SectionHeading from './SectionHeading';
import { fetchSiteSettings } from '../lib/settings';

function getTimeLeft(target: Date) {
  const now  = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function toArabicNumerals(n: number): string {
  return String(n).padStart(2, '0');//.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const display = toArabicNumerals(value);

  return (
    <div className="flex flex-col items-center">
      <div
        className="countdown-number relative w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: '16px',
          perspective: '500px',
        }}
      >
        {/* تأثير التدوير 3D */}
        <motion.div
          key={`digit-${display}`}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-3xl sm:text-4xl md:text-6xl"
          style={{
            fontFamily: 'Amiri, serif',
            background: 'linear-gradient(180deg, #ffffff, #f2c4ce, #c2637a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {display}
        </motion.div>

        {/* خط في المنتصف */}
        <div className="absolute inset-x-2 top-1/2 h-px" style={{ background: 'rgba(242,196,206,0.15)' }} />

        {/* نقاط زاوية */}
        <div className="absolute top-2 right-2 w-1 h-1 rounded-full" style={{ background: '#f2c4ce', opacity: 0.4 }} />
        <div className="absolute top-2 left-2  w-1 h-1 rounded-full" style={{ background: '#f2c4ce', opacity: 0.4 }} />
        <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full" style={{ background: '#f2c4ce', opacity: 0.4 }} />
        <div className="absolute bottom-2 left-2  w-1 h-1 rounded-full" style={{ background: '#f2c4ce', opacity: 0.4 }} />

        <motion.div
          key={`flash-${display}`}
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(242,196,206,0.12)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <p
        className="text-xs mt-3"
        style={{
          fontFamily: 'Tajawal, sans-serif',
          color: 'rgba(242,196,206,0.7)',
          letterSpacing: '0.2em',
        }}
      >
        {label}
      </p>
    </div>
  );
}

const DEFAULT_TARGET = new Date('2026-10-10T18:00:00');

export default function CountdownTimer() {
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [time, setTime] = useState(() => getTimeLeft(DEFAULT_TARGET));

  useEffect(() => {
    fetchSiteSettings().then(s => setTarget(new Date(s.wedding_datetime))).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <section className="py-20 md:py-28 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(194,99,122,0.06), transparent)',
        }}
      />

      {/* ورود زخرفية في الخلفية */}
      <motion.div
        className="absolute top-10 right-[5%] pointer-events-none opacity-30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <Rose size={60} variant="bloom" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-[5%] pointer-events-none opacity-25"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      >
        <Rose size={50} variant="side" />
      </motion.div>

      <div className="relative z-10 text-center px-4 sm:px-6">
        <SectionHeading eyebrow="العدّ التنازليّ حتى" title="اليوم المنتظر" className="mb-8 md:mb-10" />

        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 md:gap-6 justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TimeUnit value={time.days}    label="يوم"    />
          <span
            className="text-3xl md:text-4xl mb-6 hidden sm:inline"
            style={{ fontFamily: 'Amiri, serif', color: 'rgba(242,196,206,0.4)' }}
          >
            :
          </span>
          <TimeUnit value={time.hours}   label="ساعة"   />
          <span
            className="text-3xl md:text-4xl mb-6 hidden sm:inline"
            style={{ fontFamily: 'Amiri, serif', color: 'rgba(242,196,206,0.4)' }}
          >
            :
          </span>
          <TimeUnit value={time.minutes} label="دقيقة"  />
          <span
            className="text-3xl md:text-4xl mb-6 hidden sm:inline"
            style={{ fontFamily: 'Amiri, serif', color: 'rgba(242,196,206,0.4)' }}
          >
            :
          </span>
          <TimeUnit value={time.seconds} label="ثانية"  />
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #f2c4ce)' }} />
          <HeartRose size={18} />
          <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #f2c4ce, transparent)' }} />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl italic mt-6"
          style={{
            fontFamily: 'Scheherazade New, serif',
            color: 'rgba(242,196,206,0.55)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          روحان في جسدٍ واحد، وحبٌّ يدوم للأبد
        </motion.p>
      </div>
    </section>
  );
}
