import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rose, HeartRose } from './Rose';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 7 + 2.5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, #2a131c 0%, #180d10 60%, #0a0508 100%)',
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {/* وردة متفتحة 3D في المنتصف */}
          <div className="relative scene-3d mb-10" style={{ width: 180, height: 180 }}>
            {/* حلقات زخرفية متحركة */}
            {[160, 140, 120].map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: s,
                  height: s,
                  top: (180 - s) / 2,
                  left: (180 - s) / 2,
                  border: `1px solid rgba(242,196,206,${0.35 - i * 0.08})`,
                  borderStyle: i === 1 ? 'dashed' : 'solid',
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
                transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* الوردة تتفتح */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 30px rgba(242,196,206,0.5))' }}
              >
                <Rose size={110} variant="bloom" />
              </motion.div>
            </motion.div>
          </div>

          <motion.p
            className="text-3xl tracking-widest mb-2"
            style={{
              fontFamily: 'Amiri, serif',
              background: 'linear-gradient(135deg, #f2c4ce, #ffffff, #c2637a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            دعوة زفاف
          </motion.p>

          <motion.p
            className="text-sm mb-10"
            style={{
              fontFamily: 'Scheherazade New, serif',
              color: 'rgba(242,196,206,0.55)',
              letterSpacing: '0.2em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            لحظة من الورد لا تُنسى
          </motion.p>

          {/* شريط التقدم */}
          <div
            className="w-56 h-[3px] relative overflow-hidden rounded-full"
            style={{ background: 'rgba(242,196,206,0.12)' }}
          >
            <motion.div
              className="absolute inset-y-0 right-0"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #c2637a, #f2c4ce, #ffffff)',
                boxShadow: '0 0 12px rgba(242,196,206,0.7)',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <HeartRose size={14} />
            <p
              className="text-xs"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                color: 'rgba(242,196,206,0.6)',
              }}
            >
              {toArabicNum(Math.min(Math.round(progress), 100))}٪
            </p>
            <HeartRose size={14} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function toArabicNum(n: number) {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
}
