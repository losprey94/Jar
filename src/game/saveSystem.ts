import type { GameState } from './gameState';

const SAVE_KEY = 'tiny-terra-save-v1';

export const saveGame = (state: GameState) => {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
};

export const loadGame = (): GameState | null => {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
};

export const resetSave = () => localStorage.removeItem(SAVE_KEY);
