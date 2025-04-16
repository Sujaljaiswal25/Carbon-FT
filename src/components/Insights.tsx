import React from 'react';
import { Activity } from '../types';
import { Lightbulb } from 'lucide-react';

interface InsightsProps {
  activities: Activity[];
}

export default function Insights({ activities }: InsightsProps) {
  const generateInsights = () => {
    const insights: string[] = [];
    
    const categoryTotals = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + activity.co2Emissions;
      return acc;
    }, {} as Record<string, number>);

    if (categoryTotals.travel && categoryTotals.travel > 50) {
      insights.push("Consider using public transport or biking for short trips to reduce your travel emissions.");
    }

    const meatMeals = activities.filter(a => a.category === 'food' && a.type === 'meat').length;
    if (meatMeals > 3) {
      insights.push("Try incorporating more plant-based meals into your diet to reduce your food carbon footprint.");
    }

    if (categoryTotals.shopping && categoryTotals.shopping > 100) {
      insights.push("Consider buying second-hand items or repairing existing ones to reduce consumption impact.");
    }

    if (categoryTotals.electricity && categoryTotals.electricity > 30) {
      insights.push("Switch to LED bulbs and remember to turn off unused appliances to save electricity.");
    }

    if (activities.length > 0) {
      const totalEmissions = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
      insights.push(`Your total carbon footprint is ${totalEmissions.toFixed(2)} kg CO2. Small changes in daily habits can help reduce this!`);
    }

    return insights;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-semibold">Insights & Tips</h2>
      </div>

      <div className="space-y-4">
        {generateInsights().map((insight, index) => (
          <div
            key={index}
            className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800"
          >
            <p className="text-emerald-800 dark:text-emerald-200">{insight}</p>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Start logging activities to get personalized insights!
          </div>
        )}
      </div>
    </div>
  );
}