import { useEffect, useMemo, useState } from 'react';
import ActionPanel, { type ActionDef } from './components/ActionPanel';
import CollectionPanel from './components/CollectionPanel';
import ResearchPanel from './components/ResearchPanel';
import ResourceBar from './components/ResourceBar';
import SettingsPanel from './components/SettingsPanel';
import TerrariumView from './components/TerrariumView';
import { addResources, autoPopulateForLevel, canAfford, initialState, levelFromLife, productionRates, spend, type FloatingGain, type GameState } from './game/gameState';
import { createObject, objectUnlockLevel, type ResourceKey, type TerrariumObjectType } from './game/objectDefinitions';
import { loadGame, resetSave, saveGame } from './game/saveSystem';

export default function App() {
  const [state, setState] = useState<GameState>(() => autoPopulateForLevel(loadGame() ?? initialState()));
  const [gains, setGains] = useState<FloatingGain[]>([]);
  const [panel, setPanel] = useState<'research' | 'collection' | 'settings' | null>(null);
  const [offlineGain, setOfflineGain] = useState<Partial<Record<ResourceKey, number>> | null>(null);

  const rates = useMemo(() => productionRates(state), [state]);
  const raining = state.rainBoostUntil > Date.now();
  const waterPps = raining ? 0.6 : 0;
  const rateView = { ...rates, water: waterPps };

  const pushGain = (text: string, tone: FloatingGain['tone']) => {
    const id = `${Date.now()}-${Math.random()}`;
    setGains((prev) => [...prev, { id, text, x: 18 + Math.random() * 62, y: 22 + Math.random() * 60, tone }]);
    setTimeout(() => setGains((prev) => prev.filter((g) => g.id !== id)), 1100);
  };

  useEffect(() => {
    const diff = Math.max(0, Math.min((Date.now() - state.lastSavedAt) / 1000, 60 * 60 * 6));
    if (diff > 8) setOfflineGain({ light: rates.light * diff, life: rates.life * diff, spores: rates.spores * diff });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => {
        const p = productionRates(s);
        const w = s.rainBoostUntil > Date.now() ? 0.6 : 0;
        const lifeGain = p.life;
        const lifeTotal = s.lifeGeneratedTotal + lifeGain;
        const nextLevel = levelFromLife(lifeTotal);
        const next = autoPopulateForLevel({ ...s, resources: addResources(s.resources, { light: p.light, life: p.life, spores: p.spores, water: w }), lifeGeneratedTotal: lifeTotal, terrariumLevel: nextLevel, lastSavedAt: Date.now() });
        saveGame(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const commitState = (updater: (s: GameState) => GameState) => setState((s) => {
    const next = updater(s);
    saveGame(next);
    return next;
  });

  const payAndApply = (cost: Partial<Record<ResourceKey, number>>, apply: (s: GameState) => GameState) => commitState((s) => (canAfford(s.resources, cost) ? apply({ ...s, resources: spend(s.resources, cost) }) : s));

  const waterTap = 4 * (state.research.some((r) => r.id === 'humidityBoost' && r.purchased) ? 1.3 : 1) * (raining ? 2 : 1);

  const actions: ActionDef[] = [
    { key: 'water', icon: '💧', label: 'Tap Water', cost: `+${waterTap.toFixed(0)} Water`, disabled: false, onClick: () => { commitState((s)=>({ ...s, resources: addResources(s.resources, { water: waterTap }) })); pushGain(`+${waterTap.toFixed(0)} Water`, 'water'); } },
    { key: 'moss', icon: '🟢', label: 'Grow Moss', cost: '8 Water', disabled: !canAfford(state.resources, { water: 8 }), onClick: () => payAndApply({ water: 8 }, (s) => ({ ...s, moss: s.moss + 1, objects: [...s.objects, createObject('moss')], discovered: [...new Set([...s.discovered, 'moss'])] })) },
    { key: 'mush', icon: '🍄', label: 'Mushroom', cost: '12 Water + 4 Life', disabled: !canAfford(state.resources, { water: 12, life: 4 }), onClick: () => payAndApply({ water: 12, life: 4 }, (s) => { const type = Math.random() > 0.55 ? 'mushroomSmall' : 'mushroomTall'; return { ...s, mushrooms: s.mushrooms + 1, objects: [...s.objects, createObject(type)], discovered: [...new Set([...s.discovered, type])] }; }) },
    { key: 'plant', icon: '🌱', label: 'Tiny Plant', cost: '10 Water + 10 Light', disabled: !canAfford(state.resources, { water: 10, light: 10 }), onClick: () => payAndApply({ water: 10, light: 10 }, (s) => { const type = Math.random() > 0.5 ? 'plantTiny' : 'fern'; return { ...s, plants: s.plants + 1, objects: [...s.objects, createObject(type)], discovered: [...new Set([...s.discovered, type])] }; }) },
    { key: 'bug', icon: '🐞', label: 'Add Bug', cost: '14 Life + 10 Spores', disabled: !canAfford(state.resources, { life: 14, spores: 10 }), onClick: () => payAndApply({ life: 14, spores: 10 }, (s) => ({ ...s, bugs: s.bugs + 1, objects: [...s.objects, createObject('bug')], discovered: [...new Set([...s.discovered, 'bug'])] })) },
    { key: 'lamp', icon: '🕯️', label: 'Upgrade Lamp', cost: '20 Light + 12 Spores', disabled: !canAfford(state.resources, { light: 20, spores: 12 }), onClick: () => payAndApply({ light: 20, spores: 12 }, (s) => ({ ...s, lampLevel: s.lampLevel + 1 })) },
    { key: 'rain', icon: '🌧️', label: 'Rain Boost', cost: '15 Light', disabled: !canAfford(state.resources, { light: 15 }), onClick: () => payAndApply({ light: 15 }, (s) => ({ ...s, rainBoostUntil: Date.now() + 15_000 })) }
  ];

  return <main className='app'>
    <ResourceBar resources={state.resources} rates={rateView} />
    <TerrariumView state={state} gains={gains} raining={raining} />
    <nav className='side-buttons'><button onClick={()=>setPanel('research')}>Research</button><button onClick={()=>setPanel('collection')}>Collection</button><button onClick={()=>setPanel('settings')}>Settings</button></nav>
    <ActionPanel actions={actions} />

    {panel === 'research' && <ResearchPanel nodes={state.research} onClose={() => setPanel(null)} canBuy={(n)=>canAfford(state.resources,n.cost)} onBuy={(id)=>{ const node=state.research.find((n)=>n.id===id); if(!node) return; payAndApply(node.cost, (s)=>({ ...s, research:s.research.map((n)=>n.id===id?{...n,purchased:true}:n) })); }} />}
    {panel === 'collection' && <CollectionPanel discovered={state.discovered} onClose={() => setPanel(null)} />}
    {panel === 'settings' && <SettingsPanel onClose={() => setPanel(null)} soundOn={state.soundOn} reducedAnimation={state.reducedAnimation} onSound={() => commitState((s)=>({ ...s, soundOn: !s.soundOn }))} onAnimation={() => commitState((s)=>({ ...s, reducedAnimation: !s.reducedAnimation }))} onReset={() => { resetSave(); setState(initialState()); }} />}

    {offlineGain && <section className='overlay panel'><h3>🌙 While you were away</h3><p>Light +{Math.floor(offlineGain.light ?? 0)} • Life +{Math.floor(offlineGain.life ?? 0)} • Spores +{Math.floor(offlineGain.spores ?? 0)}</p><button onClick={() => { commitState((s)=>({ ...s, resources: addResources(s.resources, offlineGain) })); setOfflineGain(null); }}>Claim Reward</button><button>Double with ad</button></section>}
  </main>;
}
