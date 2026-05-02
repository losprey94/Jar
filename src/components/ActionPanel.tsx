interface ActionDef { key: string; icon: string; label: string; cost: string; disabled: boolean; onClick: () => void; }

export default function ActionPanel({ actions }: { actions: ActionDef[] }) {
  return <section className="action-panel">{actions.map((a) => <button key={a.key} onClick={a.onClick} disabled={a.disabled}><span>{a.icon}</span>{a.label}<small>{a.cost}</small></button>)}</section>;
}
