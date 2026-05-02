import { useEffect, useMemo, useState } from 'react';
import ActionPanel from './components/ActionPanel';
import CollectionPanel from './components/CollectionPanel';
import ResearchPanel from './components/ResearchPanel';
import ResourceBar from './components/ResourceBar';
import SettingsPanel from './components/SettingsPanel';
import TerrariumView from './components/TerrariumView';
import { canAfford, initialState, levelFromLife, productionRates, spend, type FloatingGain, type GameState } from './game/gameState';
import { createObject } from './game/objectDefinitions';
import { loadGame, resetSave, saveGame } from './game/saveSystem';

export default function App() {
  const [state, setState] = useState<GameState>(() => loadGame() ?? initialState);
  const [gains, setGains] = useState<FloatingGain[]>([]);
  const [panel, setPanel] = useState<'research' | 'collection' | 'settings' | null>(null);
  const [offlineGain, setOfflineGain] = useState<{ water: number; light: number; life: number; spores: number } | null>(null);

  const rates = useMemo(() => productionRates(state), [state]);

  useEffect(() => {
    const diff = Math.min(60 * 60, (Date.now() - state.lastSavedAt) / 1000);
    if (diff > 5) {
      setOfflineGain({ water: 0, light: rates.light * diff, life: rates.life * diff, spores: rates.spores * diff });
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        const r = productionRates(s);
        const lifeGain = r.life;
        const next = {
          ...s,
          resources: { ...s.resources, light: s.resources.light + r.light, life: s.resources.life + r.life, spores: s.resources.spores + r.spores },
          lifeGeneratedTotal: s.lifeGeneratedTotal + lifeGain,
          terrariumLevel: levelFromLife(s.lifeGeneratedTotal + lifeGain),
          lastSavedAt: Date.now()
        };
        saveGame(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const addGain = (text: string) => {
    const g = { id: `${Date.now()}-${Math.random()}`, text, x: 20 + Math.random() * 60, y: 25 + Math.random() * 50 };
    setGains((prev) => [...prev, g]);
    setTimeout(() => setGains((prev) => prev.filter((v) => v.id !== g.id)), 1000);
  };

  const buy = (cost: any, apply: (s: GameState) => GameState) => {
    setState((s) => {
      if (!canAfford(s.resources, cost)) return s;
      const next = apply({ ...s, resources: spend(s.resources, cost) });
      saveGame(next);
      return next;
    });
  };

  const raining = state.rainBoostUntil > Date.now();
  const waterTapAmount = 4 * (state.research.find((r) => r.id === 'humidityBoost')?.purchased ? 1.3 : 1) * (raining ? 2 : 1);

  const actions = [
    { key: 'water', icon: '💧', label: 'Tap Water', cost: `+${waterTapAmount.toFixed(0)} Water`, disabled: false, onClick: () => { setState((s) => ({ ...s, resources: { ...s.resources, water: s.resources.water + waterTapAmount } })); addGain(`+${waterTapAmount.toFixed(0)}💧`);} },
    { key: 'moss', icon: '🟢', label: 'Grow Moss', cost: '8 Water', disabled: !canAfford(state.resources, { water: 8 }), onClick: () => buy({ water: 8 }, (s)=>({ ...s, moss: s.moss+1, objects:[...s.objects, createObject('moss')], discovered:[...new Set([...s.discovered,'moss'])] }))},
    { key: 'mush', icon: '🍄', label: 'Mushroom', cost: '12 Water + 4 Life', disabled: !canAfford(state.resources, { water: 12, life: 4 }), onClick: () => buy({ water:12, life:4 }, (s)=>({ ...s, mushrooms:s.mushrooms+1, objects:[...s.objects,createObject(Math.random()>.5?'mushroomSmall':'mushroomTall')], discovered:[...new Set([...s.discovered,'mushroomSmall','mushroomTall'])]}))},
    { key: 'plant', icon: '🌱', label: 'Tiny Plant', cost: '10 Water + 10 Light', disabled: !canAfford(state.resources, { water: 10, light: 10 }), onClick: () => buy({ water:10, light:10 }, (s)=>({ ...s, plants:s.plants+1, objects:[...s.objects,createObject(Math.random()>.5?'plantTiny':'fern')], discovered:[...new Set([...s.discovered,'plantTiny','fern'])]}))},
    { key: 'bug', icon: '🐞', label: 'Add Bug', cost: '14 Life + 10 Spores', disabled: !canAfford(state.resources, { life:14, spores:10 }), onClick: () => buy({ life:14, spores:10 }, (s)=>({ ...s, bugs:s.bugs+1, objects:[...s.objects,createObject('bug')], discovered:[...new Set([...s.discovered,'bug'])]}))},
    { key: 'lamp', icon: '🕯️', label: 'Upgrade Lamp', cost: '20 Light + 12 Spores', disabled: !canAfford(state.resources, { light:20, spores:12 }), onClick: () => buy({ light:20, spores:12 }, (s)=>({ ...s, lampLevel:s.lampLevel+1 }))},
    { key: 'rain', icon: '🌧️', label: 'Rain Boost', cost: '15 Light', disabled: !canAfford(state.resources, { light:15 }), onClick: () => buy({ light:15 }, (s)=>({ ...s, rainBoostUntil: Date.now()+15000 }))}
  ];

  return <main className='app'>
    <ResourceBar state={state} />
    <TerrariumView state={state} gains={gains} raining={raining} />
    <div className='side-buttons'><button onClick={()=>setPanel('research')}>Research</button><button onClick={()=>setPanel('collection')}>Collection</button><button onClick={()=>setPanel('settings')}>Settings</button></div>
    <ActionPanel actions={actions} />
    {panel === 'research' && <ResearchPanel nodes={state.research} onClose={()=>setPanel(null)} onBuy={(id)=>buy(state.research.find(n=>n.id===id)?.cost ?? {}, (s)=>({ ...s, research:s.research.map(n=>n.id===id?{...n,purchased:true}:n) }))} />}
    {panel === 'collection' && <CollectionPanel discovered={state.discovered} onClose={()=>setPanel(null)} />}
    {panel === 'settings' && <SettingsPanel onClose={()=>setPanel(null)} soundOn={state.soundOn} reducedAnimation={state.reducedAnimation} onSound={()=>setState(s=>({...s,soundOn:!s.soundOn}))} onAnimation={()=>setState(s=>({...s,reducedAnimation:!s.reducedAnimation}))} onReset={()=>{resetSave();setState(initialState);}} />}
    {offlineGain && <div className='overlay'><h3>While you were away</h3><p>Light +{offlineGain.light.toFixed(0)} • Life +{offlineGain.life.toFixed(0)} • Spores +{offlineGain.spores.toFixed(0)}</p><button onClick={()=>{setState(s=>({...s,resources:{water:s.resources.water+offlineGain.water,light:s.resources.light+offlineGain.light,life:s.resources.life+offlineGain.life,spores:s.resources.spores+offlineGain.spores}}));setOfflineGain(null);}}>Claim Reward</button><button>Double with ad</button></div>}
  </main>;
}
