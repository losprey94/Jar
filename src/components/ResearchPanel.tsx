import type { ResearchNode } from '../game/upgrades';

export default function ResearchPanel({ nodes, onBuy, onClose }: { nodes: ResearchNode[]; onBuy: (id: ResearchNode['id']) => void; onClose: () => void }) {
  return <div className="overlay"><h3>Research Grove</h3><button onClick={onClose}>Close</button>{nodes.map((n)=><button key={n.id} disabled={n.purchased} onClick={()=>onBuy(n.id)}>{n.name} - {n.description}</button>)}</div>;
}
