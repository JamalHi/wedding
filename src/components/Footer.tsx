import { motion } from 'framer-motion';
import { Rose, HeartRose, Monogram } from './Rose';

export default function Footer() {
  return (
    <footer className="py-12 md:py-16 relative overflow-hidden" dir="rtl">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(242,196,206,0.4), transparent)',
        }}
      />

      {/* ورود زاوية */}
      <div className="absolute -top-6 right-[8%] opacity-40 hidden md:block">
        <motion.div animate={{ rotate: [0, 8, -5, 0] }} transition={{ duration: 8, repeat: Infinity }}>
          <Rose size={50} variant="bloom" />
        </motion.div>
      </div>
      <div className="absolute -top-6 left-[8%] opacity-40 hidden md:block">
        <motion.div animate={{ rotate: [0, -8, 5, 0] }} transition={{ duration: 8, repeat: Infinity }}>
          <Rose size={50} variant="side" />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* الأسماء */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <span
              className="text-3xl"
              style={{
                fontFamily: 'Amiri, serif',
                color: 'rgba(242,196,206,0.85)',
              }}
            >
              جمال
            </span>
            <div className="flex flex-col items-center gap-1">
              <HeartRose size={20} />
              <div className="h-4 w-px" style={{ background: 'rgba(242,196,206,0.3)' }} />
              <HeartRose size={12} />
            </div>
            <span
              className="text-3xl"
              style={{
                fontFamily: 'Amiri, serif',
                color: 'rgba(242,196,206,0.85)',
              }}
            >
              سوار
            </span>
          </div>

          <p
            className="text-lg mb-6 italic"
            style={{
              fontFamily: 'Scheherazade New, serif',
              color: 'rgba(242,196,206,0.6)',
            }}
          >
            10 أوكتوبر 2026 • دمشق، اتستراد المزة
          </p>

          <div className="divider mb-8" />

          <p
            className="text-base max-w-md mx-auto mb-8 italic"
            style={{
              fontFamily: 'Scheherazade New, serif',
              color: 'rgba(255,245,247,0.7)',
              lineHeight: 2.2,
            }}
          >
            الزواج ليس اسماً؛ إنه فعلٌ. إنه الطريقة التي تُحبّ بها شريك حياتك كلّ يوم
          </p>

          {/* الهاشتاغ */}
          <div
            className="inline-flex items-center gap-3 px-6 py-3"
            style={{
              border: '1px solid rgba(242,196,206,0.25)',
              borderRadius: '999px',
              background: 'rgba(242,196,206,0.04)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              className="text-xs"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                color: 'rgba(242,196,206,0.6)',
                letterSpacing: '0.15em',
              }}
            >
              شاركوا فرحتكم
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                direction: 'ltr',
                color: '#f2c4ce',
                fontWeight: 600,
              }}
            >
              #جمال_وسوار_2026
            </span>
          </div>

          {/* المونوغرام */}
          <div className="flex justify-center mt-10">
            <Monogram size={70} />
          </div>
        </motion.div>

        <motion.p
          className="text-xs mt-10"
          style={{
            fontFamily: 'Tajawal, sans-serif',
            color: 'rgba(242,196,206,0.4)',
            letterSpacing: '0.15em',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          صُنع بكلّ محبّة • ٢٠٢٦
        </motion.p>
      </div>
    </footer>
  );
}
