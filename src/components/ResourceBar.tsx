import { fmt, type GameState } from '../game/gameState';

export default function ResourceBar({ state }: { state: GameState }) {
  const rates = {
    light: 0,
    life: 0,
    spores: 0,
    water: 0
  };
  return (
    <header className="resource-bar">
      {[
        ['💧', 'Water', state.resources.water, rates.water],
        ['💡', 'Light', state.resources.light, state.lampLevel * 0.5 + 0.8],
        ['🌿', 'Life', state.resources.life, state.moss * 0.38],
        ['✨', 'Spores', state.resources.spores, state.mushrooms * 0.26]
      ].map(([icon, label, value, pps]) => (
        <div key={label as string} className="resource-pill">
          <div>{icon}</div>
          <div>
            <strong>{fmt(value as number)}</strong>
            <small>{label} • +{(pps as number).toFixed(1)}/s</small>
          </div>
        </div>
      ))}
    </header>
  );
}
