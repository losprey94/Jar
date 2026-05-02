export type ResourceKey = 'water' | 'light' | 'life' | 'spores';
export type TerrariumObjectType = 'moss' | 'mushroomSmall' | 'mushroomTall' | 'plantTiny' | 'fern' | 'bug' | 'glowSpore' | 'stone' | 'root';

export interface PlacedObject {
  id: string;
  type: TerrariumObjectType;
  x: number;
  y: number;
  scale: number;
  hue: number;
  flip: boolean;
  glow: boolean;
}

export const objectUnlockLevel: Record<TerrariumObjectType, number> = { moss: 1, stone: 1, root: 1, mushroomSmall: 2, mushroomTall: 2, plantTiny: 3, fern: 3, bug: 4, glowSpore: 4 };
export const organismRarity: Record<TerrariumObjectType, 'Common' | 'Uncommon' | 'Rare' | 'Magical'> = { moss: 'Common', stone: 'Common', root: 'Common', mushroomSmall: 'Uncommon', mushroomTall: 'Uncommon', plantTiny: 'Rare', fern: 'Rare', bug: 'Rare', glowSpore: 'Magical' };

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const createObject = (type: TerrariumObjectType): PlacedObject => ({ id: uid(), type, x: 8 + Math.random() * 84, y: 18 + Math.random() * 74, scale: 0.68 + Math.random() * 0.95, hue: -14 + Math.random() * 28, flip: Math.random() > 0.5, glow: Math.random() > 0.88 });
