import React, { useState } from 'react';
import { Activity, EMISSION_FACTORS } from '../types';
import { saveActivity } from '../utils/storage';
import { PlusCircle } from 'lucide-react';

interface ActivityLoggerProps {
  onActivityAdded: () => void;
}

export default function ActivityLogger({ onActivityAdded }: ActivityLoggerProps) {
  const [category, setCategory] = useState('travel');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');

  const calculateEmissions = (category: string, type: string, quantity: number): number => {
    const factor = EMISSION_FACTORS.find(f => f.category === category && f.type === type);
    return factor ? factor.factor * quantity : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activity: Activity = {
      id: Date.now().toString(),
      category: category as Activity['category'],
      type,
      quantity: Number(quantity),
      date: new Date().toISOString(),
      co2Emissions: calculateEmissions(category, type, Number(quantity))
    };

    saveActivity(activity);
    onActivityAdded();
    setType('');
    setQuantity('');
  };

  const getTypeOptions = () => {
    return EMISSION_FACTORS
      .filter(factor => factor.category === category)
      .map(factor => factor.type);
  };

  const getUnit = () => {
    const factor = EMISSION_FACTORS.find(f => f.category === category && f.type === type);
    return factor ? factor.unit.split('/')[1] : '';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-semibold">Log Activity</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="electricity">Electricity</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field"
          >
            <option value="">Select type</option>
            {getTypeOptions().map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity ({getUnit()})
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
            placeholder={`Enter ${getUnit()}`}
            min="0"
            step="0.1"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Log Activity
        </button>
      </form>
    </div>
  );
}