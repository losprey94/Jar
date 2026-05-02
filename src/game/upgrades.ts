import type { ResourceKey } from './objectDefinitions';

export interface ResearchNode {
  id: 'betterLamp' | 'richSoil' | 'humidityBoost' | 'sporeBloom' | 'ecosystemBalance';
  name: string;
  description: string;
  cost: Partial<Record<ResourceKey, number>>;
  purchased: boolean;
}

export const baseResearch = (): ResearchNode[] => [
  { id: 'betterLamp', name: 'Better Lamp', description: '+0.65 Light/s', cost: { light: 35, spores: 12 }, purchased: false },
  { id: 'richSoil', name: 'Rich Soil', description: '+28% Life from moss', cost: { water: 45, life: 16 }, purchased: false },
  { id: 'humidityBoost', name: 'Humidity Boost', description: '+30% Tap Water', cost: { light: 30, spores: 10 }, purchased: false },
  { id: 'sporeBloom', name: 'Spore Bloom', description: '+45% Spore generation', cost: { life: 36, spores: 24 }, purchased: false },
  { id: 'ecosystemBalance', name: 'Ecosystem Balance', description: '+15% all production', cost: { light: 70, life: 54, spores: 34 }, purchased: false }
];
