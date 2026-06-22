import { motion } from 'framer-motion';
import { MapPin, Phone, Globe, Navigation } from 'lucide-react';
import { Rose } from './Rose';
import SectionHeading from './SectionHeading';

export default function VenueSection() {
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6504858736247!2d46.67255391499984!3d24.68773398413143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sKing%20Abdullah%20Road%2C%20Riyadh!5e0!3m2!1sar!2ssa!4v1620000000000!5m2!1sar!2ssa';

  return (
    <section id="venue" className="py-16 md:py-24 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(24,13,16,0.6), transparent)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="مكان الحفل"
          title="أين نحتفل"
          intro="انضمّوا إلينا في قاعة الملكية الفاخرة لسهرة تجمع الأناقة والفرح"
          className="text-center mb-10 md:mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* الخريطة */}
          <motion.div
            className="map-container scene-3d"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative" style={{ paddingTop: '65%' }}>
              <iframe
                src={mapSrc}
                className="absolute inset-0 w-full h-full"
                style={{
                  border: 0,
                  filter: 'grayscale(30%) sepia(40%) hue-rotate(310deg) brightness(0.7) saturate(140%)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع قاعة الأفراح"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(24,13,16,0.85), transparent)' }}
              />
            </div>
          </motion.div>

          {/* معلومات المكان */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div>
              <h3
                className="text-3xl mb-2"
                style={{
                  fontFamily: 'Amiri, serif',
                  background: 'linear-gradient(180deg, #ffffff, #f2c4ce)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                القاعة الملكية
              </h3>
              <p
                className="text-xl italic"
                style={{ fontFamily: 'Scheherazade New, serif', color: '#c2637a' }}
              >
                أفخم قاعات المناسبات في المدينة
              </p>
            </div>

            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(270deg, rgba(242,196,206,0.5), transparent)' }}
            />

            <div className="space-y-4">
              {[
                { Icon: MapPin, label: 'العنوان', value: ' دمشق، اتستراد المزة ' },
                { Icon: Phone,  label: 'الهاتف',  value: '‎+966 11 XXX XXXX' },
                { Icon: Globe,  label: 'الموقع',  value: 'rosepalace-riyadh.com' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4 items-start group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(242,196,206,0.18), rgba(194,99,122,0.06))',
                      border: '1px solid rgba(242,196,206,0.3)',
                    }}
                  >
                    <item.Icon size={16} color="#f2c4ce" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p
                      className="text-xs mb-1"
                      style={{
                        fontFamily: 'Tajawal, sans-serif',
                        color: 'rgba(242,196,206,0.6)',
                        letterSpacing: '0.2em',
                      }}
                    >
                      {item.label}
                    </p>
                    <p className="text-lg" style={{ fontFamily: 'Amiri, serif', color: '#fff5f7' }}>
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* المواقف */}
            <div
              className="p-5 mt-4 relative"
              style={{
                background:
                  'linear-gradient(135deg, rgba(242,196,206,0.08), rgba(194,99,122,0.04))',
                border: '1px solid rgba(242,196,206,0.18)',
                borderRadius: '14px',
              }}
            >
              <div className="absolute -top-3 -right-3">
                <Rose size={28} variant="bud" />
              </div>
              <p
                className="text-xs mb-2"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  color: '#c2637a',
                  letterSpacing: '0.2em',
                }}
              >
                مواقف السيارات والمواصلات
              </p>
              <p
                style={{
                  fontFamily: 'Scheherazade New, serif',
                  color: 'rgba(255,245,247,0.75)',
                  lineHeight: 1.9,
                }}
              >
                خدمة صفّ السيارات مجانية. تتوفّر حافلة توصيل من برج الفيصلية كل ٣٠ دقيقة ابتداءً من ٤:٣٠ م.
              </p>
            </div>

            {/* زر الاتجاهات */}
            <motion.a
              href="https://maps.google.com/?q=King+Abdullah+Road+Riyadh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full justify-center py-4 cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
                color: '#fff5f7',
                borderRadius: '999px',
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '0.92rem',
                letterSpacing: '0.1em',
                boxShadow:
                  '0 12px 30px -8px rgba(194,99,122,0.6), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation size={16} />
              احصل على الاتجاهات
            </motion.a>
          </motion.div>
        </div>

        {/* إحصاءات */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { num: '٥٠٠+', label: 'طاقة استيعابيّة' },
            { num: '٥★',   label: 'قاعة فاخرة'      },
            { num: '٣',    label: 'صالات أفراح'     },
            { num: '٢٤/٧', label: 'خدمة الكونسيرج'  },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="text-center p-5 glass card-hover"
              style={{ borderRadius: '14px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p
                className="text-2xl md:text-3xl mb-1"
                style={{
                  fontFamily: 'Amiri, serif',
                  background: 'linear-gradient(180deg, #ffffff, #f2c4ce)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.num}
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  color: 'rgba(242,196,206,0.7)',
                  letterSpacing: '0.15em',
                }}
              >
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
