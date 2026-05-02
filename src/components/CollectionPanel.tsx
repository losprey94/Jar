import { organismRarity, type TerrariumObjectType } from '../game/objectDefinitions';

const all: TerrariumObjectType[] = ['moss','stone','root','mushroomSmall','mushroomTall','plantTiny','fern','bug','glowSpore'];

export default function CollectionPanel({ discovered, onClose }: { discovered: TerrariumObjectType[]; onClose: () => void }) {
  return <div className="overlay"><h3>Collection</h3><button onClick={onClose}>Close</button>{all.map((o)=><div key={o}>{discovered.includes(o)?o:'???'} <small>{organismRarity[o]}</small></div>)}</div>;
}
