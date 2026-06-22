import { useState, useEffect, useRef } from 'react';
import LoadingScreen   from './components/LoadingScreen';
import ParticleField   from './components/ParticleField';
import Navbar          from './components/Navbar';
import HeroSection     from './components/HeroSection';
import CountdownTimer  from './components/CountdownTimer';
import StorySection    from './components/StorySection';
import EventDetails    from './components/EventDetails';
import GallerySection  from './components/GallerySection';
import VenueSection    from './components/VenueSection';
import RSVPSection     from './components/RSVPSection';
import Footer          from './components/Footer';
import { HeartRose }   from './components/Rose';

/** أثر بتلات وردية يتبع المؤشر — تعطّل تلقائياً على أجهزة اللمس */
function CursorTrail() {
  const [sparks, setSparks] = useState<{ x: number; y: number; id: number; color: string }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const colors = ['#f2c4ce', '#c2637a', '#ffffff', '#e8a3b3'];
    let lastTime = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 35) return;
      lastTime = now;
      const newSpark = {
        x: e.clientX,
        y: e.clientY,
        id: counter.current++,
        color: colors[counter.current % colors.length],
      };
      setSparks(prev => [...prev.slice(-14), newSpark]);
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== newSpark.id));
      }, 700);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {sparks.map((spark, i) => (
        <div
          key={spark.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: spark.x,
            top: spark.y,
            background: spark.color,
            transform: 'translate(-50%, -50%)',
            opacity: ((i + 1) / sparks.length) * 0.65,
            boxShadow: `0 0 ${6 + i * 0.5}px ${spark.color}`,
            transition: 'opacity 0.7s ease',
          }}
        />
      ))}
    </div>
  );
}

/** فاصل أنيق بين الأقسام */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-3 px-4 sm:px-6">
      <div
        className="flex-1 h-px max-w-xs"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(242,196,206,0.25), transparent)' }}
      />
      <div className="mx-6 flex items-center gap-3">
        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(242,196,206,0.4)' }} />
        <HeartRose size={14} />
        <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(242,196,206,0.4)' }} />
      </div>
      <div
        className="flex-1 h-px max-w-xs"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(242,196,206,0.25), transparent)' }}
      />
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative" style={{ background: '#180d10' }}>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <ParticleField />
      <CursorTrail />

      <div className="relative z-10">
        <Navbar />

        <main>
          <HeroSection />
          <SectionDivider />
          <CountdownTimer />
          <SectionDivider />
          <StorySection />
          <SectionDivider />
          <EventDetails />
          <SectionDivider />
          <GallerySection />
          <SectionDivider />
          <VenueSection />
          <SectionDivider />
          <RSVPSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}
