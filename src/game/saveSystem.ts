import type { GameState } from './gameState';
const SAVE_KEY = 'tiny-terra-save-v2';

export const saveGame = (state: GameState) => {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
};

export const loadGame = (): GameState | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
};

export const resetSave = () => localStorage.removeItem(SAVE_KEY);
