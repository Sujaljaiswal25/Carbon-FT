export interface User {
  name: string;
  goal: string;
  theme: 'light' | 'dark';
}

export interface Activity {
  id: string;
  category: 'travel' | 'food' | 'shopping' | 'electricity';
  type: string;
  quantity: number;
  date: string;
  co2Emissions: number;
}

export interface EmissionFactor {
  category: string;
  type: string;
  factor: number;
  unit: string;
}

export const EMISSION_FACTORS: EmissionFactor[] = [
  { category: 'travel', type: 'car', factor: 0.12, unit: 'kg CO2/km' },
  { category: 'travel', type: 'bus', factor: 0.08, unit: 'kg CO2/km' },
  { category: 'travel', type: 'train', factor: 0.04, unit: 'kg CO2/km' },
  { category: 'travel', type: 'plane', factor: 0.25, unit: 'kg CO2/km' },
  { category: 'food', type: 'meat', factor: 3.0, unit: 'kg CO2/meal' },
  { category: 'food', type: 'vegetarian', factor: 1.2, unit: 'kg CO2/meal' },
  { category: 'food', type: 'vegan', factor: 0.8, unit: 'kg CO2/meal' },
  { category: 'shopping', type: 'clothes', factor: 10, unit: 'kg CO2/item' },
  { category: 'shopping', type: 'electronics', factor: 30, unit: 'kg CO2/item' },
  { category: 'electricity', type: 'usage', factor: 0.5, unit: 'kg CO2/kWh' },
];