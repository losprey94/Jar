import type { ResearchNode } from '../game/upgrades';

export default function ResearchPanel({ nodes, onBuy, canBuy, onClose }: { nodes: ResearchNode[]; onBuy: (id: ResearchNode['id']) => void; canBuy: (n: ResearchNode) => boolean; onClose: () => void }) {
  return <section className="overlay panel"><h3>🔬 Research Grove</h3><button className="ghost" onClick={onClose}>Close</button>{nodes.map((n)=><button key={n.id} className="node" disabled={n.purchased || !canBuy(n)} onClick={()=>onBuy(n.id)}><b>{n.name}</b><small>{n.description}</small><small>Cost: {Object.entries(n.cost).map(([k,v])=>`${v} ${k}`).join(' • ')}</small></button>)}</section>;
}
