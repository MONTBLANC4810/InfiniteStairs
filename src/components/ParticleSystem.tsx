import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const ParticleSystem: React.FC<{ active: boolean; x: number; y: number }> = ({ active, x, y }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x,
        y: y + 20,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 5,
        life: 1.0,
      }));
      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [active, x, y]);

  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.1 }))
          .filter(p => p.life > 0)
      );
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute w-2 h-2 bg-white/60 pixelated"
          style={{ 
            left: `${p.x}px`, 
            top: `${p.y}px`, 
            opacity: p.life,
            transform: `scale(${p.life})`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;
