import { baseResearch, type ResearchNode } from './upgrades';
import { createObject, type PlacedObject, type ResourceKey, type TerrariumObjectType } from './objectDefinitions';

export interface Resources {
  water: number;
  light: number;
  life: number;
  spores: number;
}

export interface FloatingGain { id: string; text: string; x: number; y: number; }

export interface GameState {
  resources: Resources;
  objects: PlacedObject[];
  terrariumLevel: number;
  lifeGeneratedTotal: number;
  lampLevel: number;
  rainBoostUntil: number;
  bugs: number;
  plants: number;
  moss: number;
  mushrooms: number;
  research: ResearchNode[];
  discovered: TerrariumObjectType[];
  reducedAnimation: boolean;
  soundOn: boolean;
  lastSavedAt: number;
}

export const initialState: GameState = {
  resources: { water: 20, light: 20, life: 0, spores: 0 },
  objects: [createObject('stone'), createObject('root'), createObject('moss')],
  terrariumLevel: 1,
  lifeGeneratedTotal: 0,
  lampLevel: 1,
  rainBoostUntil: 0,
  bugs: 0,
  plants: 0,
  moss: 1,
  mushrooms: 0,
  research: baseResearch,
  discovered: ['moss', 'stone', 'root'],
  reducedAnimation: false,
  soundOn: false,
  lastSavedAt: Date.now()
};

export const fmt = (n: number) => (n < 10 ? n.toFixed(1) : Math.floor(n).toString());

const researchBonus = (state: GameState, id: ResearchNode['id']) => state.research.find((r) => r.id === id)?.purchased;

export const productionRates = (state: GameState) => {
  const lampBase = 0.8 + state.lampLevel * 0.5 + state.plants * 0.08;
  const mossBase = state.moss * 0.38 * (1 + state.plants * 0.06);
  const mushBase = state.mushrooms * 0.26;
  const bugBoost = 1 + state.bugs * 0.05;

  let light = lampBase;
  let life = mossBase;
  let spores = mushBase;

  if (researchBonus(state, 'betterLamp')) light += 0.6;
  if (researchBonus(state, 'richSoil')) life *= 1.25;
  if (researchBonus(state, 'sporeBloom')) spores *= 1.4;
  if (researchBonus(state, 'ecosystemBalance')) {
    light *= 1.12;
    life *= 1.12;
    spores *= 1.12;
  }

  return { light: light * bugBoost, life: life * bugBoost, spores: spores * bugBoost };
};

export const levelFromLife = (lifeTotal: number) => {
  if (lifeTotal >= 260) return 5;
  if (lifeTotal >= 140) return 4;
  if (lifeTotal >= 70) return 3;
  if (lifeTotal >= 25) return 2;
  return 1;
};

export const canAfford = (resources: Resources, cost: Partial<Record<ResourceKey, number>>) =>
  Object.entries(cost).every(([k, v]) => resources[k as ResourceKey] >= (v ?? 0));

export const spend = (resources: Resources, cost: Partial<Record<ResourceKey, number>>): Resources => {
  const copy = { ...resources };
  (Object.entries(cost) as [ResourceKey, number][]).forEach(([k, v]) => {
    copy[k] -= v;
  });
  return copy;
};
