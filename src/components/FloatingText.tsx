import type { FloatingGain } from '../game/gameState';

export default function FloatingText({ gains }: { gains: FloatingGain[] }) {
  return (
    <div className="floating-layer">
      {gains.map((gain) => (
        <span key={gain.id} className="floating-gain" style={{ left: `${gain.x}%`, top: `${gain.y}%` }}>
          {gain.text}
        </span>
      ))}
    </div>
  );
}
