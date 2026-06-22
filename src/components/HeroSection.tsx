import { useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { Rose, Leaf, HeartRose } from './Rose';
// (الأسماء العربية تعرض كاملة، الأنيميشن على الكلمة لا الأحرف)

/** ورود ثلاثية الأبعاد عائمة حول العنوان */
const FLOATING_ROSES = [
  { top: '12%', left: '8%',  size: 90,  depth: 0.6,  rot: -20, variant: 'bloom' as const, delay: 0    },
  { top: '20%', left: '85%', size: 70,  depth: 0.4,  rot: 25,  variant: 'side'  as const, delay: 0.4  },
  { top: '70%', left: '5%',  size: 55,  depth: 0.8,  rot: 40,  variant: 'bud'   as const, delay: 0.8  },
  { top: '78%', left: '88%', size: 65,  depth: 0.5,  rot: -30, variant: 'bloom' as const, delay: 1.2  },
  { top: '50%', left: '3%',  size: 40,  depth: 0.9,  rot: 60,  variant: 'side'  as const, delay: 1.6  },
  { top: '40%', left: '92%', size: 45,  depth: 0.7,  rot: -45, variant: 'bud'   as const, delay: 2.0  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);

  // tilt thoughtful interaction based on cursor (desktop only)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltSpringX = useSpring(tiltX, { stiffness: 80, damping: 18 });
  const tiltSpringY = useSpring(tiltY, { stiffness: 80, damping: 18 });

  // parallax based on scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const yBg     = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const yMid    = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const yFg     = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useLayoutEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current!.querySelectorAll('[data-anim="name"]'), {
        y: 120,
        opacity: 0,
        rotateX: -70,
        scale: 0.9,
        stagger: 0.25,
        duration: 1.4,
        ease: 'power4.out',
        delay: 0.5,
      });
    });
    return () => ctx.revert();
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    tiltY.set(cx * 12);    // rotateY
    tiltX.set(-cy * 8);    // rotateX
  };
  const onMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const scrollToRsvp    = () => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToDetails = () => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden scene-3d pt-24 md:pt-20"
      dir="rtl"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* خلفية وردية متوهجة */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: yBg,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(194,99,122,0.25), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(242,196,206,0.18), transparent 70%)',
        }}
      />

      {/* هالات منيرة متحركة */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{ y: yMid }}
      >
        <div
          style={{
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, transparent, rgba(242,196,206,0.06), transparent, rgba(194,99,122,0.08), transparent)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* ورود عائمة 3D parallax */}
      {FLOATING_ROSES.map((r, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: r.top,
            left: r.left,
            y: r.depth > 0.6 ? yFg : yMid,
            filter: `drop-shadow(0 10px 25px rgba(194,99,122,${0.3 * r.depth}))`,
            opacity: 0.5 + r.depth * 0.4,
          }}
          initial={{ scale: 0, rotate: r.rot - 180, opacity: 0 }}
          animate={{ scale: 1, rotate: r.rot, opacity: 0.5 + r.depth * 0.4 }}
          transition={{ duration: 1.6, delay: r.delay, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotateZ: [0, 6, -4, 0],
            }}
            transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Rose size={r.size} variant={r.variant} rotate={0} />
          </motion.div>
        </motion.div>
      ))}

      {/* الزخارف الخلفية: زجاج */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: yMid, opacity }}
      >
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[90vw] max-w-3xl h-[70vh] rounded-[40px]"
          style={{
            border: '1px solid rgba(242,196,206,0.08)',
            background:
              'linear-gradient(180deg, rgba(242,196,206,0.04), transparent 60%)',
          }}
        />
      </motion.div>

      {/* المحتوى الرئيسي */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
        style={{
          opacity,
          scale,
          rotateX: tiltSpringX,
          rotateY: tiltSpringY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* تمهيد */}
        <motion.p
          className="text-sm md:text-base mb-5"
          style={{
            fontFamily: 'Tajawal, sans-serif',
            color: 'rgba(242,196,206,0.7)',
            letterSpacing: '0.4em',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          بحضور ذويهما الكرام
        </motion.p>

        {/* خط زخرفي */}
        <motion.div
          className="flex items-center gap-4 justify-center mb-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(90deg, transparent, #f2c4ce)' }} />
          <Rose size={32} variant="side" />
          <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(90deg, #f2c4ce, transparent)' }} />
        </motion.div>

        {/* الأسماء — 3D (الكلمة كاملة لإبقاء اتصال الأحرف العربية) */}
        <div ref={titleRef} className="mb-4" style={{ transformStyle: 'preserve-3d' }}>
          <div
            data-anim="name"
            className="text-6xl sm:text-7xl md:text-9xl leading-tight mb-1 select-none name-letter inline-block"
            style={{
              fontFamily: 'Amiri, serif',
              transform: 'translateZ(80px)',
              filter: 'drop-shadow(0 12px 30px rgba(194,99,122,0.45))',
              transformOrigin: 'center bottom',
            }}
          >
            جمال
          </div>

          <div
            className="text-3xl md:text-5xl my-2"
            style={{
              fontFamily: 'Scheherazade New, serif',
              color: '#c2637a',
              fontStyle: 'italic',
              transform: 'translateZ(40px)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              و
            </motion.span>
          </div>

          <div
            data-anim="name"
            className="text-7xl md:text-9xl leading-tight select-none name-letter inline-block"
            style={{
              fontFamily: 'Amiri, serif',
              transform: 'translateZ(80px)',
              filter: 'drop-shadow(0 12px 30px rgba(194,99,122,0.45))',
              transformOrigin: 'center bottom',
            }}
          >
            سوار
          </div>
        </div>

        {/* فاصل ورد */}
        <motion.div
          className="flex items-center justify-center gap-4 my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <div className="h-px w-12 md:w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(242,196,206,0.6))' }} />
          <Leaf size={20} rotate={-30} />
          <HeartRose size={20} />
          <Leaf size={20} rotate={30} />
          <div className="h-px w-12 md:w-24" style={{ background: 'linear-gradient(90deg, rgba(242,196,206,0.6), transparent)' }} />
        </motion.div>

        {/* النصوص الترحيبية */}
        <motion.div
          className="space-y-3 md:space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <p
            className="text-xl md:text-2xl"
            style={{
              fontFamily: 'Scheherazade New, serif',
              color: 'rgba(255,245,247,0.85)',
              fontStyle: 'italic',
            }}
          >
            يتشرّفان بدعوتكم الكريمة
          </p>
          <p
            className="text-lg md:text-xl"
            style={{
              fontFamily: 'Amiri, serif',
              color: 'rgba(242,196,206,0.85)',
            }}
          >
            لحضور حفل زفافهما المبارك
          </p>
          <p
            className="text-2xl md:text-3xl"
            style={{
              fontFamily: 'Amiri, serif',
              fontWeight: 700,
              color: '#f2c4ce',
              textShadow: '0 0 30px rgba(242,196,206,0.4)',
            }}
          >
            السبت، العاشر من أوكتوبر
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              color: 'rgba(242,196,206,0.6)',
              letterSpacing: '0.3em',
            }}
          >
            ألفان وستة وعشرون
          </p>
        </motion.div>

        {/* الأزرار */}
        <motion.div
          className="flex flex-col sm:flex-row-reverse gap-4 justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <button
            onClick={scrollToRsvp}
            className="relative group px-10 py-4 overflow-hidden cursor-pointer transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
              color: '#fff5f7',
              border: 'none',
              borderRadius: '999px',
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.15em',
              fontSize: '0.92rem',
              boxShadow:
                '0 15px 35px -10px rgba(194,99,122,0.7), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 25px 50px -10px rgba(242,196,206,0.55), inset 0 1px 0 rgba(255,255,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 15px 35px -10px rgba(194,99,122,0.7), inset 0 1px 0 rgba(255,255,255,0.18)';
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <HeartRose size={16} />
              تأكيد الحضور
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          <button
            onClick={scrollToDetails}
            className="px-10 py-4 cursor-pointer transition-all duration-300"
            style={{
              border: '1px solid rgba(242,196,206,0.4)',
              borderRadius: '999px',
              background: 'rgba(242,196,206,0.04)',
              backdropFilter: 'blur(10px)',
              color: '#f2c4ce',
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.15em',
              fontSize: '0.92rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#f2c4ce';
              e.currentTarget.style.background = 'rgba(242,196,206,0.10)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(242,196,206,0.4)';
              e.currentTarget.style.background = 'rgba(242,196,206,0.04)';
              e.currentTarget.style.color = '#f2c4ce';
            }}
          >
            عرض التفاصيل
          </button>
        </motion.div>
      </motion.div>

      {/* مؤشر التمرير */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ opacity }}
      >
        <span
          className="text-xs"
          style={{
            fontFamily: 'Tajawal, sans-serif',
            color: 'rgba(242,196,206,0.6)',
            letterSpacing: '0.3em',
          }}
        >
          مرّر للأسفل
        </span>
        <motion.div
          className="w-px h-12"
          style={{ background: 'linear-gradient(180deg, rgba(242,196,206,0.7), transparent)' }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
