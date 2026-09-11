import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JHARKHAND_DISTRICTS } from '../data/jharkhandData';

const JharkhandMap: React.FC = () => {
  const navigate = useNavigate();

  const handleDistrictClick = (district: string) => {
    navigate(`/challenges?district=${encodeURIComponent(district)}`);
  };

  // Simplified coordinates for Jharkhand districts to create a conceptual map
  const districts = JHARKHAND_DISTRICTS.map((name, index) => ({
    name,
    points: generateSimplifiedPolygon(index)
  }));

  function generateSimplifiedPolygon(index: number) {
    const centerX = 200 + (index % 6) * 40;
    const centerY = 100 + Math.floor(index / 6) * 40;
    const size = 30;
    return [
      `${centerX - size},${centerY - size}`,
      `${centerX + size},${centerY - size}`,
      `${centerX + size},${centerY + size}`,
      `${centerX - size},${centerY + size}`,
    ].join(' ');
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-paper-tint rounded-2xl border border-border p-8 flex items-center justify-center overflow-hidden">
      <div className="absolute top-4 left-4">
        <span className="editorial-meta">Interactive District Map</span>
        <p className="text-xs text-muted mt-1">Click a district to view local challenges</p>
      </div>

      <svg
        viewBox="0 0 600 400"
        className="w-full h-full drop-shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {districts.map((d) => (
          <polygon
            key={d.name}
            points={d.points}
            className="fill-white stroke-ink stroke-1 cursor-pointer transition-all duration-300 hover:fill-accent hover:stroke-accent"
            onClick={() => handleDistrictClick(d.name)}
          >
            <title>{d.name}</title>
          </polygon>
        ))}

        {/* Labeling some major districts for context since shapes are simplified */}
        {JHARKHAND_DISTRICTS.slice(0, 8).map((name, index) => {
          const centerX = 200 + (index % 6) * 40;
          const centerY = 100 + Math.floor(index / 6) * 40;
          return (
            <text
              key={`text-${name}`}
              x={centerX}
              y={centerY}
              textAnchor="middle"
              className="text-[8px] fill-muted pointer-events-none font-medium"
            >
              {name}
            </text>
          );
        })}
      </svg>

      <div className="absolute bottom-4 right-4 text-right">
        <p className="text-[10px] text-muted italic">Conceptual map representation</p>
      </div>
    </div>
  );
};

export default JharkhandMap;