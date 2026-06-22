import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music, Camera, Heart, Utensils } from 'lucide-react';
import { Rose } from './Rose';
import SectionHeading from './SectionHeading';

const events = [
  { time: '٥:٠٠ م', title: 'استقبال الضيوف',       description: 'استقبال حارّ مع المرطّبات والموسيقى الحيّة', Icon: Music },
  { time: '٦:٠٠ م', title: 'حفل عقد القران',        description: 'مراسم العقد المقدّس في القاعة الكبرى',     Icon: Heart },
  { time: '٧:٠٠ م', title: 'جلسة تصوير تذكاريّة',  description: 'توثيق اللحظات الجميلة مع العروسين',         Icon: Camera },
  { time: '٨:٠٠ م', title: 'عشاء وسهرة الاحتفال', description: 'عشاء فاخر يليه رقص واحتفال بهيج',          Icon: Utensils },
];

const details = [
  { Icon: Calendar, label: 'التاريخ', value: 'السبت، 10 أوكتوبر ٢٠٢٦',   sub: 'سجّل الموعد في مفكّرتك'             },
  { Icon: Clock,    label: 'التوقيت', value: '٥:٠٠ م – ١٢:٠٠ ص',         sub: 'الأبواب تُفتح الساعة ٤:٣٠ م'         },
  { Icon: MapPin,   label: 'المكان',  value: 'القاعة الملكية',  sub: 'دمشق اتستراد المزة'         },
];

export default function EventDetails() {
  return (
    <section id="details" className="py-16 md:py-24 relative" dir="rtl">
      {/* خلفية وردية ناعمة */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #f2c4ce 0px, #f2c4ce 1px, transparent 1px, transparent 24px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading eyebrow="تفاصيل الزفاف" title="تفاصيل الاحتفال" className="text-center mb-12 md:mb-16" />

        {/* بطاقات المعلومات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-14 md:mb-20 scene-3d">
          {details.map((item, i) => (
            <motion.div
              key={i}
              className="glass card-hover tilt-3d p-8 text-center relative overflow-hidden"
              style={{ borderRadius: '20px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* وردة زاوية */}
              <div className="absolute -top-4 -right-4 opacity-50">
                <Rose size={40} variant="bloom" />
              </div>

              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background:
                    'radial-gradient(circle, rgba(242,196,206,0.25), rgba(194,99,122,0.08))',
                  border: '1px solid rgba(242,196,206,0.4)',
                  boxShadow: '0 8px 25px rgba(194,99,122,0.25), inset 0 0 12px rgba(242,196,206,0.15)',
                }}
              >
                <item.Icon size={24} color="#f2c4ce" strokeWidth={1.5} />
              </div>

              <p
                className="text-xs mb-2"
                style={{ fontFamily: 'Tajawal, sans-serif', color: '#c2637a', letterSpacing: '0.25em' }}
              >
                {item.label}
              </p>
              <p
                className="text-lg mb-1"
                style={{ fontFamily: 'Amiri, serif', color: '#fff5f7' }}
              >
                {item.value}
              </p>
              <p
                className="text-sm italic"
                style={{ fontFamily: 'Scheherazade New, serif', color: 'rgba(242,196,206,0.6)' }}
              >
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* برنامج الحفل */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10 md:mb-12">
            <p
              className="text-sm mb-2"
              style={{ fontFamily: 'Tajawal, sans-serif', color: 'rgba(242,196,206,0.7)', letterSpacing: '0.3em' }}
            >
              برنامج الحفل
            </p>
            <h3
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: 'Amiri, serif',
                background: 'linear-gradient(180deg, #ffffff, #f2c4ce)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              سهرة لا تُنسى
            </h3>
          </div>

          {/* خط رأسي للجدول الزمني */}
          <div
            className="absolute right-1/2 top-32 bottom-0 w-px translate-x-1/2 hidden md:block"
            style={{
              background:
                'linear-gradient(180deg, rgba(242,196,206,0.5), rgba(194,99,122,0.2))',
            }}
          />

          <div className="space-y-6 md:space-y-4">
            {events.map((event, i) => (
              <motion.div
                key={i}
                className={`relative flex flex-col md:flex-row items-center md:gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                  <div
                    className="inline-block glass p-6 card-hover"
                    style={{ minWidth: '280px', borderRadius: '16px' }}
                    dir="rtl"
                  >
                    <p
                      className="text-sm mb-2"
                      style={{ fontFamily: 'Amiri, serif', color: '#c2637a', letterSpacing: '0.15em' }}
                    >
                      {event.time}
                    </p>
                    <h4
                      className="text-xl mb-2"
                      style={{ fontFamily: 'Amiri, serif', color: '#f2c4ce' }}
                    >
                      {event.title}
                    </h4>
                    <p
                      className="italic"
                      style={{ fontFamily: 'Scheherazade New, serif', color: 'rgba(255,245,247,0.7)' }}
                    >
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* نقطة وسطى */}
                <motion.div
                  className="relative z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
                    boxShadow: '0 0 25px rgba(194,99,122,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                  whileHover={{ scale: 1.15 }}
                >
                  <event.Icon size={18} color="#fff5f7" strokeWidth={1.5} />
                </motion.div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* كود اللباس */}
        <motion.div
          className="mt-14 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="inline-block px-12 py-7 relative glass tilt-3d"
            style={{ borderRadius: '20px' }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Rose size={36} variant="side" />
            </div>
            <p
              className="text-sm mb-2 mt-2"
              style={{ fontFamily: 'Tajawal, sans-serif', color: 'rgba(242,196,206,0.7)', letterSpacing: '0.3em' }}
            >
              كود اللباس
            </p>
            <p
              className="text-2xl"
              style={{
                fontFamily: 'Amiri, serif',
                background: 'linear-gradient(180deg, #ffffff, #f2c4ce)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              رسميّ فاخر — Black Tie
            </p>
            <p
              className="mt-1 italic"
              style={{ fontFamily: 'Scheherazade New, serif', color: 'rgba(242,196,206,0.6)' }}
            >
              الألوان المفضّلة: الورديّ والأبيض
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
