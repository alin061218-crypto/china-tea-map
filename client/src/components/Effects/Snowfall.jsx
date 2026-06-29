import { useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';

function createSnowflakes(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 3 + Math.random() * 8,
    duration: 6 + Math.random() * 12,
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 80,
    opacity: 0.3 + Math.random() * 0.5,
  }));
}

export default function Snowfall() {
  const { season } = useSeason();
  const flakes = useMemo(() => createSnowflakes(50), []);

  if (season !== 'winter') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-25">
      {flakes.map(f => (
        <div key={f.id}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: '-10px',
            width: f.size,
            height: f.size,
            background: 'rgba(220,225,235,0.9)',
            borderRadius: '50%',
            filter: `blur(${f.size > 6 ? '1px' : '0px'})`,
            animation: `snowFall ${f.duration}s linear ${f.delay}s infinite`,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  );
}
