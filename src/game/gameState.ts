import { createObject, objectUnlockLevel, type PlacedObject, type ResourceKey, type TerrariumObjectType } from './objectDefinitions';
import { baseResearch, type ResearchNode } from './upgrades';

export interface Resources { water: number; light: number; life: number; spores: number; }
export interface FloatingGain { id: string; text: string; x: number; y: number; tone?: 'water' | 'life' | 'spore' | 'light'; }

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

export const initialState = (): GameState => ({
  resources: { water: 20, light: 20, life: 0, spores: 0 },
  objects: [createObject('stone'), createObject('root'), createObject('moss'), createObject('glowSpore')],
  terrariumLevel: 1,
  lifeGeneratedTotal: 0,
  lampLevel: 1,
  rainBoostUntil: 0,
  bugs: 0,
  plants: 0,
  moss: 1,
  mushrooms: 0,
  research: baseResearch(),
  discovered: ['moss', 'stone', 'root', 'glowSpore'],
  reducedAnimation: false,
  soundOn: false,
  lastSavedAt: Date.now()
});

export const fmt = (n: number) => (n < 10 ? n.toFixed(1) : Math.floor(n).toString());

const hasResearch = (s: GameState, id: ResearchNode['id']) => s.research.some((n) => n.id === id && n.purchased);

export const productionRates = (s: GameState) => {
  let light = 0.75 + s.lampLevel * 0.45 + s.plants * 0.1;
  let life = s.moss * 0.35 * (1 + s.plants * 0.075);
  let spores = s.mushrooms * 0.22;
  const global = 1 + s.bugs * 0.06;

  if (hasResearch(s, 'betterLamp')) light += 0.65;
  if (hasResearch(s, 'richSoil')) life *= 1.28;
  if (hasResearch(s, 'sporeBloom')) spores *= 1.45;
  if (hasResearch(s, 'ecosystemBalance')) {
    light *= 1.15;
    life *= 1.15;
    spores *= 1.15;
  }

  return { light: light * global, life: life * global, spores: spores * global };
};

export const levelFromLife = (lifeTotal: number) => {
  if (lifeTotal >= 420) return 5;
  if (lifeTotal >= 220) return 4;
  if (lifeTotal >= 100) return 3;
  if (lifeTotal >= 35) return 2;
  return 1;
};

export const canAfford = (resources: Resources, cost: Partial<Record<ResourceKey, number>>) =>
  Object.entries(cost).every(([k, v]) => resources[k as ResourceKey] >= (v ?? 0));

export const spend = (resources: Resources, cost: Partial<Record<ResourceKey, number>>): Resources => {
  const out = { ...resources };
  (Object.entries(cost) as [ResourceKey, number][]).forEach(([k, v]) => {
    out[k] = Math.max(0, out[k] - v);
  });
  return out;
};

export const addResources = (resources: Resources, add: Partial<Record<ResourceKey, number>>): Resources => ({
  water: resources.water + (add.water ?? 0),
  light: resources.light + (add.light ?? 0),
  life: resources.life + (add.life ?? 0),
  spores: resources.spores + (add.spores ?? 0)
});

export const autoPopulateForLevel = (state: GameState): GameState => {
  const unlocked = (Object.keys(objectUnlockLevel) as TerrariumObjectType[]).filter((k) => objectUnlockLevel[k] <= state.terrariumLevel);
  const targetCount = 7 + state.terrariumLevel * 5;
  const objects: PlacedObject[] = [...state.objects];
  while (objects.length < targetCount) objects.push(createObject(unlocked[Math.floor(Math.random() * unlocked.length)]));
  return { ...state, objects };
};
