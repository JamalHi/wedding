import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

/**
 * زر موسيقى عائم. ضع ملف الموسيقى في public/audio/wedding-theme.mp3
 * (المتصفحات تمنع التشغيل التلقائي بصوت، لذا التشغيل يبدأ فقط بضغطة المستخدم على الزر)
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}audio/wedding.mp3`} loop preload="none" />
      <motion.button
        onClick={toggle}
        aria-label={playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: 'rgba(24,13,16,0.55)',
          border: '1px solid rgba(242,196,206,0.3)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          boxShadow: playing
            ? '0 0 25px rgba(242,196,206,0.4), 0 8px 20px rgba(24,13,16,0.4)'
            : '0 8px 20px rgba(24,13,16,0.4)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.5 }}
        whileTap={{ scale: 0.92 }}
      >
        {playing && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(242,196,206,0.4)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.div
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={playing ? { duration: 6, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
        >
          <Music2 size={20} color="#f2c4ce" />
        </motion.div>
      </motion.button>
    </>
  );
}
