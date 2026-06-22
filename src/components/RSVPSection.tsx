import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Users, MessageSquare, ChevronDown } from 'lucide-react';
import { Rose, HeartRose } from './Rose';
import SectionHeading from './SectionHeading';

type Status     = 'idle' | 'submitting' | 'success' | 'error';
type Attendance = 'yes' | 'no' | 'maybe' | '';

interface FormData {
  name:       string;
  email:      string;
  phone:      string;
  attendance: Attendance;
  guests:     string;
  dietary:    string;
  message:    string;
}

const initialForm: FormData = {
  name: '', email: '', phone: '', attendance: '', guests: '1', dietary: '', message: '',
};

export default function RSVPSection() {
  const [form,   setForm]   = useState<FormData>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim())                                          errs.name       = 'الاسم مطلوب';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))     errs.email      = 'البريد الإلكتروني غير صحيح';
    if (!form.attendance)                                           errs.attendance = 'يرجى اختيار حضورك';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');
    await new Promise(r => setTimeout(r, 1800));
    setStatus('success');
  };

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  if (status === 'success') {
    return (
      <section id="rsvp" className="py-16 md:py-24" dir="rtl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="relative w-28 h-28 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(242,196,206,0.4)' }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
                  boxShadow: '0 0 40px rgba(194,99,122,0.6)',
                }}
              >
                <Check size={42} color="#fff5f7" strokeWidth={2.5} />
              </div>
            </div>

            <h2
              className="text-4xl mb-4"
              style={{
                fontFamily: 'Amiri, serif',
                background: 'linear-gradient(180deg, #ffffff, #f2c4ce)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              سنراكم في الحفل!
            </h2>
            <p
              className="text-xl mb-6 italic"
              style={{
                fontFamily: 'Scheherazade New, serif',
                color: 'rgba(255,245,247,0.85)',
                lineHeight: 2,
              }}
            >
              شكراً لكَ يا {form.name}، وصلنا تأكيد حضورك بكلّ فرحٍ وسرور
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                color: 'rgba(242,196,206,0.6)',
              }}
            >
              تم إرسال رسالة تأكيد إلى {form.email}
            </p>

            <div className="mt-10 flex gap-4 justify-center items-end">
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ delay: i * 0.18, duration: 1.8, repeat: Infinity }}
                >
                  <Rose size={28 + (i % 2) * 8} variant={i % 3 === 0 ? 'bloom' : i % 3 === 1 ? 'side' : 'bud'} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-16 md:py-24 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(194,99,122,0.08), transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="تأكيد الحضور"
          title="انضمّوا إلى احتفالنا"
          intro="يُرجى الردّ قبل الأول من يونيو ٢٠٢٦"
          className="text-center mb-10 md:mb-12"
        />

        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="p-6 sm:p-8 md:p-10 space-y-6 relative"
            style={{
              background:
                'linear-gradient(135deg, rgba(242,196,206,0.06), rgba(194,99,122,0.03))',
              border: '1px solid rgba(242,196,206,0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 30px 60px -20px rgba(24,13,16,0.6)',
            }}
          >
            {/* ورود زاوية */}
            <div className="absolute -top-5 -right-5">
              <Rose size={40} variant="bloom" />
            </div>
            <div className="absolute -bottom-5 -left-5">
              <Rose size={36} variant="bud" />
            </div>

            {/* الاسم + البريد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="text-xs block"
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    color: 'rgba(242,196,206,0.75)',
                    letterSpacing: '0.2em',
                  }}
                >
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="اسمك الكامل"
                  className="rsvp-input w-full px-4 py-3 text-lg"
                  style={{ fontFamily: 'Amiri, serif', borderRadius: '12px' }}
                />
                {errors.name && (
                  <p className="text-xs" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs block"
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    color: 'rgba(242,196,206,0.75)',
                    letterSpacing: '0.2em',
                  }}
                >
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="your@email.com"
                  className="rsvp-input w-full px-4 py-3 text-lg"
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    direction: 'ltr',
                    textAlign: 'right',
                    borderRadius: '12px',
                  }}
                />
                {errors.email && (
                  <p className="text-xs" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* الجوال */}
            <div className="space-y-2">
              <label
                className="text-xs block"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  color: 'rgba(242,196,206,0.75)',
                  letterSpacing: '0.2em',
                }}
              >
                رقم الجوال
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="‎+966 XX XXX XXXX"
                className="rsvp-input w-full px-4 py-3 text-lg"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  direction: 'ltr',
                  textAlign: 'right',
                  borderRadius: '12px',
                }}
              />
            </div>

            {/* الحضور */}
            <div className="space-y-3">
              <label
                className="text-xs block"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  color: 'rgba(242,196,206,0.75)',
                  letterSpacing: '0.2em',
                }}
              >
                هل ستحضر؟ *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'yes',   label: 'سأحضر بكلّ سرور', variant: 'bloom' as const },
                  { value: 'no',    label: 'آسف، لن أتمكّن',  variant: 'bud'   as const },
                  { value: 'maybe', label: 'سأحاول الحضور',   variant: 'side'  as const },
                ].map(opt => {
                  const active = form.attendance === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, attendance: opt.value as Attendance }))}
                      className="py-4 px-3 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-2"
                      style={{
                        background: active
                          ? 'linear-gradient(135deg, rgba(194,99,122,0.35), rgba(123,58,76,0.15))'
                          : 'rgba(242,196,206,0.04)',
                        border: active
                          ? '1px solid rgba(242,196,206,0.5)'
                          : '1px solid rgba(242,196,206,0.15)',
                        color: active ? '#fff5f7' : 'rgba(242,196,206,0.75)',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '0.85rem',
                        borderRadius: '14px',
                        boxShadow: active ? '0 8px 25px -8px rgba(194,99,122,0.5)' : 'none',
                      }}
                    >
                      <Rose size={28} variant={opt.variant} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {errors.attendance && (
                <p className="text-xs" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>
                  {errors.attendance}
                </p>
              )}
            </div>

            {/* عدد الضيوف */}
            <AnimatePresence>
              {form.attendance === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label
                    className="text-xs block"
                    style={{
                      fontFamily: 'Tajawal, sans-serif',
                      color: 'rgba(242,196,206,0.75)',
                      letterSpacing: '0.2em',
                    }}
                  >
                    <Users size={12} className="inline ml-2" />
                    عدد الحضور
                  </label>
                  <div className="relative">
                    <select
                      value={form.guests}
                      onChange={set('guests')}
                      className="rsvp-input w-full px-4 py-3 text-lg appearance-none cursor-pointer"
                      style={{ fontFamily: 'Amiri, serif', borderRadius: '12px' }}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n} style={{ background: '#180d10', color: '#fff5f7' }}>
                          {n} {n === 1 ? 'ضيف' : 'ضيوف'}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      color="rgba(242,196,206,0.6)"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* المتطلبات الغذائية */}
            <div className="space-y-2">
              <label
                className="text-xs block"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  color: 'rgba(242,196,206,0.75)',
                  letterSpacing: '0.2em',
                }}
              >
                متطلبات غذائيّة خاصة
              </label>
              <input
                type="text"
                value={form.dietary}
                onChange={set('dietary')}
                placeholder="نباتي، خالٍ من الغلوتين..."
                className="rsvp-input w-full px-4 py-3 text-lg"
                style={{ fontFamily: 'Amiri, serif', borderRadius: '12px' }}
              />
            </div>

            {/* رسالة */}
            <div className="space-y-2">
              <label
                className="text-xs block"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  color: 'rgba(242,196,206,0.75)',
                  letterSpacing: '0.2em',
                }}
              >
                <MessageSquare size={12} className="inline ml-2" />
                رسالة للعروسين
              </label>
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={4}
                placeholder="شاركنا أمنياتك ودعواتك..."
                className="rsvp-input w-full px-4 py-3 text-lg resize-none"
                style={{
                  fontFamily: 'Scheherazade New, serif',
                  lineHeight: 2,
                  borderRadius: '12px',
                }}
              />
            </div>

            {/* زر الإرسال */}
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className="relative w-full py-4 overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
                color: '#fff5f7',
                border: 'none',
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.2em',
                borderRadius: '999px',
                boxShadow:
                  '0 15px 35px -10px rgba(194,99,122,0.7), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              {status === 'submitting' ? (
                <span className="flex items-center gap-3 justify-center">
                  <motion.div
                    className="w-4 h-4 rounded-full"
                    style={{ border: '2px solid rgba(255,245,247,0.3)', borderTopColor: '#fff5f7' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  جارٍ الإرسال...
                </span>
              ) : (
                <span className="flex items-center gap-3 justify-center">
                  <HeartRose size={16} />
                  تأكيد الحضور
                </span>
              )}

              {/* شريط لمعان */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
