/**
 * مكتبة عناصر ورد عصري بطبقات SVG قابلة للأنيميشن.
 * كل وردة تتكوّن من حلقات بتلات متداخلة لإيحاء العمق 3D.
 */

type RoseProps = {
  size?: number;
  className?: string;
  variant?: 'bloom' | 'bud' | 'side';
  rotate?: number;
  glow?: boolean;
};

export function Rose({
  size = 80,
  className = '',
  variant = 'bloom',
  rotate = 0,
  glow = false,
}: RoseProps) {
  const filter = glow ? 'url(#rose-glow)' : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="petal-outer" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#fde4ea" />
          <stop offset="55%"  stopColor="#f2c4ce" />
          <stop offset="100%" stopColor="#c2637a" />
        </radialGradient>
        <radialGradient id="petal-inner" cx="50%" cy="45%" r="60%">
          <stop offset="0%"   stopColor="#ffe9ef" />
          <stop offset="60%"  stopColor="#e8a3b3" />
          <stop offset="100%" stopColor="#7b3a4c" />
        </radialGradient>
        <radialGradient id="petal-core" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#7b3a4c" />
          <stop offset="100%" stopColor="#2a131c" />
        </radialGradient>
        <filter id="rose-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {variant === 'bloom' && (
        <g filter={filter}>

          {/* الطبقة الخارجية: 8 بتلات */}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={`o-${i}`}
              cx="50" cy="20" rx="14" ry="22"
              fill="url(#petal-outer)"
              opacity="0.9"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
          {/* الطبقة الوسطى: 6 بتلات أصغر */}
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={`m-${i}`}
              cx="50" cy="30" rx="10" ry="16"
              fill="url(#petal-inner)"
              opacity="0.95"
              transform={`rotate(${i * 60 + 30} 50 50)`}
            />
          ))}
          {/* الطبقة الداخلية: برعم */}
          {Array.from({ length: 4 }).map((_, i) => (
            <ellipse
              key={`i-${i}`}
              cx="50" cy="38" rx="6" ry="10"
              fill="url(#petal-core)"
              opacity="0.9"
              transform={`rotate(${i * 90 + 45} 50 50)`}
            />
          ))}
          {/* النواة */}
          <circle cx="50" cy="50" r="4" fill="#2a131c" />
          <circle cx="50" cy="50" r="2" fill="#7b3a4c" />
        </g>
      )}

      {variant === 'bud' && (
        <g filter={filter}>
          <ellipse cx="50" cy="55" rx="18" ry="28" fill="url(#petal-outer)" />
          <ellipse cx="50" cy="58" rx="13" ry="22" fill="url(#petal-inner)" transform="rotate(20 50 58)" />
          <ellipse cx="50" cy="60" rx="8"  ry="16" fill="url(#petal-core)"  transform="rotate(-15 50 60)" />
          {/* أوراق */}
          <path d="M50 78 Q 35 88 25 95" stroke="#5a7a3d" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="88" rx="6" ry="3" fill="#7ba14d" transform="rotate(-30 32 88)" />
        </g>
      )}

      {variant === 'side' && (
        <g filter={filter}>
          <path
            d="M50 18 C 32 18, 22 35, 28 52 C 32 65, 45 70, 50 70 C 55 70, 68 65, 72 52 C 78 35, 68 18, 50 18 Z"
            fill="url(#petal-outer)"
          />
          <path
            d="M50 28 C 40 28, 35 38, 38 50 C 41 60, 47 62, 50 62 C 53 62, 59 60, 62 50 C 65 38, 60 28, 50 28 Z"
            fill="url(#petal-inner)"
          />
          <ellipse cx="50" cy="48" rx="6" ry="10" fill="url(#petal-core)" />
          <circle cx="50" cy="50" r="2" fill="#2a131c" />
        </g>
      )}
    </svg>
  );
}

/** ورقة شجر صغيرة */
export function Leaf({ size = 24, rotate = 0, opacity = 0.7 }: { size?: number; rotate?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <defs>
        <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#9bbf6c" />
          <stop offset="100%" stopColor="#4a6b2a" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 C 5 8, 4 16, 12 22 C 20 16, 19 8, 12 2 Z"
        fill="url(#leaf-grad)"
        opacity={opacity}
      />
      <path d="M12 4 L 12 21" stroke="#3d5a22" strokeWidth="0.6" opacity={opacity * 0.7} />
    </svg>
  );
}

/** بتلة منفردة (تستخدم للتساقط) */
export function Petal({ size = 16, color = '#f2c4ce' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id={`petal-${color.slice(1)}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.9" />
          <stop offset="60%"  stopColor={color} />
          <stop offset="100%" stopColor="#7b3a4c" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <path
        d="M12 2 C 6 4, 4 11, 8 18 C 10 21, 14 21, 16 18 C 20 11, 18 4, 12 2 Z"
        fill={`url(#petal-${color.slice(1)})`}
      />
    </svg>
  );
}

/** زخرفة زاوية حديثة بأغصان ورد */
export function CornerVine({ size = 120, flipX = false, flipY = false }: { size?: number; flipX?: boolean; flipY?: boolean }) {
  const scale = `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: scale, overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id="vine-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#c2637a" />
          <stop offset="100%" stopColor="#f2c4ce" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* الغصن الرئيسي */}
      <path
        d="M5 5 Q 35 15, 45 45 Q 50 70, 30 100"
        stroke="url(#vine-grad)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* أوراق على الغصن */}
      <g transform="translate(22 28) rotate(45)"><Leaf size={16} opacity={0.55} /></g>
      <g transform="translate(40 55) rotate(80)"><Leaf size={14} opacity={0.5} /></g>
      <g transform="translate(36 82) rotate(120)"><Leaf size={12} opacity={0.45} /></g>
      {/* وردة كبيرة في الزاوية */}
      <g transform="translate(2 2)"><Rose size={40} variant="bloom" /></g>
      {/* برعم */}
      <g transform="translate(48 38)"><Rose size={18} variant="bud" /></g>
    </svg>
  );
}

/** قلب على شكل وردتين متعانقتين */
export function HeartRose({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="heart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f2c4ce" />
          <stop offset="100%" stopColor="#c2637a" />
        </linearGradient>
      </defs>
      <path
        d="M16 28 C 8 22, 2 16, 2 10 C 2 5, 6 2, 10 2 C 13 2, 15 4, 16 6 C 17 4, 19 2, 22 2 C 26 2, 30 5, 30 10 C 30 16, 24 22, 16 28 Z"
        fill="url(#heart-grad)"
      />
    </svg>
  );
}

/** مونوغرام (الحرف الأول للعروسين داخل إطار وردي) */
export function Monogram({ letter1 = 'ج', letter2 = 'س', size = 110 }: { letter1?: string; letter2?: string; size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* حلقة خارجية متحركة */}
      <svg className="absolute inset-0 spin-slow" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="47" stroke="#c2637a" strokeWidth="0.5" fill="none" strokeDasharray="2 6" />
      </svg>
      {/* حلقة داخلية معاكسة */}
      <svg className="absolute inset-2 spin-reverse" width={size - 16} height={size - 16} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" stroke="#f2c4ce" strokeWidth="0.4" fill="none" strokeDasharray="1 3" />
      </svg>
      {/* الأحرف */}
      <span
        className="relative z-10 text-2xl"
        style={{
          fontFamily: 'Amiri, serif',
          color: '#f2c4ce',
          letterSpacing: '0.05em',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'baseline',
        }}
      >
        {letter1}
        <span
          aria-hidden="true"
          style={{
            color: '#c2637a',
            margin: '0 4px',
            fontFamily: 'Amiri, serif',
            fontWeight: 700,
            fontSize: '0.85em',
            transform: 'translateY(-0.12em)',
            display: 'inline-block',
          }}
        >
          &
        </span>
        {letter2}
      </span>
    </div>
  );
}
