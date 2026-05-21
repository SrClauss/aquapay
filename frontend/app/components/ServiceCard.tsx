'use client';

import { useEffect, useRef } from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  delay?: number;
}

export default function ServiceCard({ icon, title, description, buttonText, onClick, delay = 0 }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    const timer = setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="glass-card rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group"
      onClick={onClick}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(6,182,212,0.1))',
          border: '1px solid rgba(14,165,233,0.3)',
        }}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-sky-200 font-bold text-base mb-2 leading-snug">{title}</h3>
        <p className="text-sky-300/60 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Button */}
      <button
        className="btn-water w-full py-3 px-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {buttonText}
      </button>
    </div>
  );
}
