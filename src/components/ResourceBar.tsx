import type { Resources } from '../game/gameState';
import { fmt } from '../game/gameState';

export default function ResourceBar({ resources, rates }: { resources: Resources; rates: { light: number; life: number; spores: number; water: number } }) {
  const items = [
    { icon: '💧', label: 'Water', v: resources.water, pps: rates.water },
    { icon: '💡', label: 'Light', v: resources.light, pps: rates.light },
    { icon: '🌿', label: 'Life', v: resources.life, pps: rates.life },
    { icon: '✨', label: 'Spores', v: resources.spores, pps: rates.spores }
  ];
  return <header className="resource-bar">{items.map((i)=><article key={i.label} className="resource-pill"><span>{i.icon}</span><div><strong>{fmt(i.v)}</strong><small>{i.label} • +{i.pps.toFixed(1)}/s</small></div></article>)}</header>;
}
