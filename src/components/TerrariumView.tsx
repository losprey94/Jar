import type { GameState } from '../game/gameState';
import FloatingText from './FloatingText';

export default function TerrariumView({ state, gains, raining }: { state: GameState; gains: any[]; raining: boolean }) {
  return (
    <section className={`terrarium-shell level-${state.terrariumLevel} ${raining ? 'raining' : ''}`}>
      <div className="lamp-beam" />
      <div className="jar">
        <div className="glass-reflection" />
        <div className="dew" />
        <div className="soil" />
        <div className="particles" />
        {state.objects.map((obj) => (
          <div
            key={obj.id}
            className={`obj ${obj.type} ${obj.glow ? 'glow' : ''}`}
            style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: `scale(${obj.scale}) scaleX(${obj.flip ? -1 : 1})`, filter: `hue-rotate(${obj.hue}deg)` }}
          />
        ))}
        <FloatingText gains={gains} />
      </div>
      <div className="level-badge">Terrarium Lv.{state.terrariumLevel}</div>
    </section>
  );
}
