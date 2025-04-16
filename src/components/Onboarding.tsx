import React, { useState } from 'react';
import { User } from '../types';
import { Leaf } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && goal) {
      onComplete({
        name,
        goal,
        theme: 'light'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900 dark:to-green-900">
      <div className="card p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-4 rounded-full">
            <Leaf className="w-12 h-12 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to EcoTrackr</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Let's start your journey to a greener future
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What's your name?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What's your environmental goal?
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a goal</option>
              <option value="Reduce my carbon footprint">Reduce my carbon footprint</option>
              <option value="Live more sustainably">Live more sustainably</option>
              <option value="Learn about environmental impact">Learn about environmental impact</option>
              <option value="Make eco-friendly choices">Make eco-friendly choices</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full">
            Start Tracking
          </button>
        </form>
      </div>
    </div>
  );
}