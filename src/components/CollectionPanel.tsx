import { organismRarity, type TerrariumObjectType } from '../game/objectDefinitions';
const all: TerrariumObjectType[] = ['moss', 'stone', 'root', 'mushroomSmall', 'mushroomTall', 'plantTiny', 'fern', 'bug', 'glowSpore'];

export default function CollectionPanel({ discovered, onClose }: { discovered: TerrariumObjectType[]; onClose: () => void }) {
  return <section className="overlay panel"><h3>📚 Collection</h3><button className="ghost" onClick={onClose}>Close</button><div className="collection-grid">{all.map((o)=><article key={o} className="entry"><div className={`silhouette ${discovered.includes(o) ? 'seen' : ''}`}>{discovered.includes(o) ? o : '????'}</div><small>{organismRarity[o]}</small></article>)}</div></section>;
}
