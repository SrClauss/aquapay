'use client';

import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

export default function WaterBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generated: Bubble[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    }));
    setBubbles(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: '-80px',
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
