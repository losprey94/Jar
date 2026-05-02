import type { FloatingGain } from '../game/gameState';

export default function FloatingText({ gains }: { gains: FloatingGain[] }) {
  return <div className="floating-layer">{gains.map((g)=><span key={g.id} className={`floating-gain ${g.tone ?? ''}`} style={{left:`${g.x}%`,top:`${g.y}%`}}>{g.text}</span>)}</div>;
}
