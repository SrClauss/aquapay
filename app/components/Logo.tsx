'use client';

export default function Logo({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: { container: 'gap-2', drop: 'w-8 h-8', title: 'text-2xl', sub: 'text-xs' },
    md: { container: 'gap-3', drop: 'w-10 h-10', title: 'text-3xl', sub: 'text-sm' },
    lg: { container: 'gap-4', drop: 'w-14 h-14', title: 'text-5xl', sub: 'text-base' },
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center ${s.container}`}>
      {/* Water drop icon */}
      <div className={`relative ${s.drop} animate-water-drop`}>
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Drop shape */}
          <path
            d="M28 4 C28 4 8 24 8 36 C8 47.05 17.0 56 28 56 C38.95 56 48 47.05 48 36 C48 24 28 4 28 4Z"
            fill="url(#dropGrad)"
            filter="url(#glow)"
            opacity="0.9"
          />
          {/* Highlight */}
          <path
            d="M21 22 C21 22 15 31 15 37 C15 39.5 16.5 41 18.5 41"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Logo text */}
      <div className="text-center">
        <div className={`${s.title} font-black tracking-widest text-glow`}
          style={{
            background: 'linear-gradient(135deg, #38bdf8, #7dd3fc, #e0f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          ÁGUA PAY
        </div>
        <div className={`${s.sub} text-sky-300/70 tracking-[0.3em] uppercase font-medium mt-1`}>
          Soluções Hídricas
        </div>
      </div>
    </div>
  );
}
