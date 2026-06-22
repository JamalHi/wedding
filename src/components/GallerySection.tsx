import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Rose, HeartRose } from './Rose';
import SectionHeading from './SectionHeading';

const photos = [
  { id: 1, gradient: 'from-[#c2637a]/60 to-[#7b3a4c]/30', label: 'يوم الخطبة',          variant: 'bloom' as const, aspect: 'tall'   },
  { id: 2, gradient: 'from-[#180d10]/50 to-[#c2637a]/30',  label: 'رحلتنا الأولى',       variant: 'side'  as const, aspect: 'wide'   },
  { id: 3, gradient: 'from-[#f2c4ce]/30 to-[#c2637a]/40',  label: 'ليلة العرض',          variant: 'bud'   as const, aspect: 'square' },
  { id: 4, gradient: 'from-[#7b3a4c]/40 to-[#180d10]/40',  label: 'صورة العائلة',        variant: 'bloom' as const, aspect: 'square' },
  { id: 5, gradient: 'from-[#c2637a]/50 to-[#f2c4ce]/20',  label: 'جلسة ما قبل الزفاف', variant: 'side'  as const, aspect: 'wide'   },
  { id: 6, gradient: 'from-[#4d2330]/50 to-[#c2637a]/30',  label: 'لحظات سعيدة',        variant: 'bloom' as const, aspect: 'tall'   },
];

function PhotoCard({ photo, onClick, index }: {
  photo: typeof photos[0]; onClick: () => void; index: number;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer group
        ${photo.aspect === 'tall' ? 'row-span-2' : ''}
        ${photo.aspect === 'wide' ? 'col-span-2' : ''}
      `}
      style={{
        borderRadius: '18px',
        border: '1px solid rgba(242,196,206,0.18)',
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${photo.gradient}`} />

      {/* الوردة في المركز */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 8px 15px rgba(24,13,16,0.5))' }}
        >
          <Rose size={photo.aspect === 'tall' ? 90 : 60} variant={photo.variant} />
        </motion.div>
        <div className="h-px w-12 mt-4" style={{ background: 'rgba(242,196,206,0.5)' }} />
        <p
          className="text-sm mt-3 italic"
          style={{ fontFamily: 'Scheherazade New, serif', color: 'rgba(255,245,247,0.85)' }}
        >
          {photo.label}
        </p>
      </div>

      {/* تأثير hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        style={{ background: 'rgba(24,13,16,0.6)', backdropFilter: 'blur(2px)' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            border: '2px solid #f2c4ce',
            boxShadow: '0 0 25px rgba(242,196,206,0.5)',
          }}
        >
          <span className="text-2xl" style={{ color: '#f2c4ce' }}>+</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const [selected, setSelected] = useState<number | null>(null);

  const prev = () => setSelected(s => (s !== null ? (s - 1 + photos.length) % photos.length : null));
  const next = () => setSelected(s => (s !== null ? (s + 1) % photos.length : null));

  return (
    <section id="gallery" className="py-16 md:py-24 relative" dir="rtl">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading eyebrow="ذكريات" title="معرض الصور" intro="لمحة من رحلتنا معاً" className="text-center mb-10 md:mb-14" />

        {/* شبكة Masonry */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[200px]">
          {photos.map((photo, i) => (
            <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => setSelected(i)} />
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(24,13,16,0.95)', backdropFilter: 'blur(20px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              {/* زر الإغلاق */}
              <button
                className="absolute top-6 left-6 w-11 h-11 rounded-full flex items-center justify-center z-10 cursor-pointer transition-all duration-300"
                style={{
                  border: '1px solid rgba(242,196,206,0.4)',
                  color: '#f2c4ce',
                  background: 'rgba(242,196,206,0.05)',
                }}
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
                onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(0) scale(1)')}
              >
                <X size={18} />
              </button>

              {/* السابق (يمين في RTL) */}
              <button
                className="absolute right-4 md:right-10 w-12 h-12 rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors duration-300"
                style={{
                  border: '1px solid rgba(242,196,206,0.3)',
                  color: '#f2c4ce',
                  background: 'rgba(242,196,206,0.05)',
                }}
                onClick={e => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="السابق"
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(194,99,122,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(242,196,206,0.05)')}
              >
                <ChevronRight size={20} />
              </button>

              {/* المحتوى */}
              <motion.div
                key={selected}
                className="relative max-w-2xl w-full mx-16"
                initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                onClick={e => e.stopPropagation()}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    minHeight: '420px',
                    borderRadius: '20px',
                    border: '1px solid rgba(242,196,206,0.2)',
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${photos[selected].gradient}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Rose size={140} variant={photos[selected].variant} glow />
                    <div className="h-px w-16 mt-2" style={{ background: 'rgba(242,196,206,0.5)' }} />
                    <p
                      className="text-3xl"
                      style={{
                        fontFamily: 'Amiri, serif',
                        color: '#fff5f7',
                        textShadow: '0 4px 20px rgba(24,13,16,0.6)',
                      }}
                    >
                      {photos[selected].label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <HeartRose size={14} />
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: 'Tajawal, sans-serif',
                      color: 'rgba(242,196,206,0.6)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {selected + 1} / {photos.length}
                  </p>
                  <HeartRose size={14} />
                </div>
              </motion.div>

              {/* التالي (يسار في RTL) */}
              <button
                className="absolute left-4 md:left-10 w-12 h-12 rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors duration-300"
                style={{
                  border: '1px solid rgba(242,196,206,0.3)',
                  color: '#f2c4ce',
                  background: 'rgba(242,196,206,0.05)',
                }}
                onClick={e => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="التالي"
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(194,99,122,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(242,196,206,0.05)')}
              >
                <ChevronLeft size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
