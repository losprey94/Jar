export interface ActionDef { key: string; icon: string; label: string; cost: string; disabled: boolean; onClick: () => void; }
export default function ActionPanel({ actions }: { actions: ActionDef[] }) {
  return <section className="action-panel">{actions.map((a)=><button key={a.key} disabled={a.disabled} onClick={a.onClick}><span>{a.icon}</span><b>{a.label}</b><small>{a.cost}</small></button>)}</section>;
}
