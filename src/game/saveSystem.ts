import { baseResearch } from './upgrades';
import { initialState, type GameState } from './gameState';

const SAVE_KEY = 'tiny-terra-save-v2';

const asNumber = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

const sanitize = (raw: unknown): GameState | null => {
  if (!raw || typeof raw !== 'object') return null;
  const def = initialState();
  const r = raw as Partial<GameState>;
  const safeResearch = Array.isArray(r.research) && r.research.length > 0
    ? baseResearch().map((node) => ({ ...node, purchased: !!r.research?.find((n) => n.id === node.id)?.purchased }))
    : baseResearch();

  return {
    ...def,
    ...r,
    resources: {
      water: asNumber(r.resources?.water, def.resources.water),
      light: asNumber(r.resources?.light, def.resources.light),
      life: asNumber(r.resources?.life, def.resources.life),
      spores: asNumber(r.resources?.spores, def.resources.spores)
    },
    objects: Array.isArray(r.objects) ? r.objects : def.objects,
    discovered: Array.isArray(r.discovered) ? r.discovered : def.discovered,
    research: safeResearch,
    terrariumLevel: asNumber(r.terrariumLevel, def.terrariumLevel),
    lifeGeneratedTotal: asNumber(r.lifeGeneratedTotal, def.lifeGeneratedTotal),
    lampLevel: asNumber(r.lampLevel, def.lampLevel),
    rainBoostUntil: asNumber(r.rainBoostUntil, def.rainBoostUntil),
    bugs: asNumber(r.bugs, def.bugs),
    plants: asNumber(r.plants, def.plants),
    moss: asNumber(r.moss, def.moss),
    mushrooms: asNumber(r.mushrooms, def.mushrooms),
    reducedAnimation: !!r.reducedAnimation,
    soundOn: !!r.soundOn,
    lastSavedAt: asNumber(r.lastSavedAt, Date.now())
  };
};

export const saveGame = (state: GameState) => {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
};

export const loadGame = (): GameState | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return sanitize(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const resetSave = () => localStorage.removeItem(SAVE_KEY);
