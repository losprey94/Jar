export interface ResearchNode {
  id: 'betterLamp' | 'richSoil' | 'humidityBoost' | 'sporeBloom' | 'ecosystemBalance';
  name: string;
  description: string;
  cost: { light?: number; spores?: number; life?: number; water?: number };
  purchased: boolean;
}

export const baseResearch: ResearchNode[] = [
  { id: 'betterLamp', name: 'Better Lamp', description: '+0.6 light/sec', cost: { light: 35, spores: 12 }, purchased: false },
  { id: 'richSoil', name: 'Rich Soil', description: '+25% life from moss', cost: { water: 40, life: 16 }, purchased: false },
  { id: 'humidityBoost', name: 'Humidity Boost', description: '+30% water tap gain', cost: { light: 28, spores: 10 }, purchased: false },
  { id: 'sporeBloom', name: 'Spore Bloom', description: '+40% spores/sec', cost: { life: 35, spores: 20 }, purchased: false },
  { id: 'ecosystemBalance', name: 'Ecosystem Balance', description: '+12% all production', cost: { light: 60, life: 45, spores: 30 }, purchased: false }
];
