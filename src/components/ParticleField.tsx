import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  rotSpeed: number;
  opacity: number;
  color: string;
  depth: number;     // 0..1  — used for 3D parallax
  swayPhase: number;
  swaySpeed: number;
}

const COLORS = ['#f2c4ce', '#e8a3b3', '#c2637a', '#ffffff'];

function makePetal(w: number, h: number): Petal {
  const depth = Math.random();
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: 0.15 + depth * 0.7,
    size: 6 + depth * 14,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    opacity: 0.25 + depth * 0.55,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    depth,
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.02,
  };
}

/** ارسم بتلة وردة على canvas */
function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.opacity;

  // تدرج البتلة
  const grad = ctx.createRadialGradient(0, -p.size * 0.3, 0, 0, 0, p.size);
  grad.addColorStop(0,   '#ffffff');
  grad.addColorStop(0.5, p.color);
  grad.addColorStop(1,   '#7b3a4c');

  ctx.fillStyle = grad;
  ctx.beginPath();
  // شكل بتلة (نصف بيضاوي)
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.7, p.size * 0.5, p.size * 0.8, 0, p.size);
  ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.8, -p.size * 0.7, -p.size * 0.7, 0, -p.size);
  ctx.closePath();
  ctx.fill();

  // خط ظل خفيف في المنتصف
  ctx.strokeStyle = 'rgba(123,58,76,0.25)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -p.size * 0.8);
  ctx.lineTo(0, p.size * 0.8);
  ctx.stroke();

  ctx.restore();
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let petals: Petal[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = reducedMotion
        ? 0
        : window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 35 : 55;
      petals = Array.from({ length: count }, () => makePetal(canvas.width, canvas.height));
    };
    resize();
    window.addEventListener('resize', resize);

    if (reducedMotion) return () => window.removeEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach(p => {
        // تمايل لطيف يحاكي الهواء
        p.swayPhase += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.4;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height + 30) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;

        drawPetal(ctx, p);
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}
