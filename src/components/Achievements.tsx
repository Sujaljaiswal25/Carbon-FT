import React from 'react';
import { Flame, Star } from 'lucide-react';
import { StreakData, Badge } from '../utils/achievements';

interface AchievementsProps {
  streak: StreakData;
  badges: Badge[];
}

export default function Achievements({ streak, badges }: AchievementsProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Achievements & Streaks</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-7 h-7 text-orange-500 animate-pulse" />
          <div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{streak.currentStreak} day streak</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Max: {streak.maxStreak}</div>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${badge.achieved ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 text-yellow-800 dark:text-yellow-200' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'}`}
              title={badge.achieved && badge.dateAchieved ? `Achieved on ${new Date(badge.dateAchieved).toLocaleDateString()}` : ''}
            >
              <Star className="w-4 h-4 mr-1" />
              {badge.label}
              {badge.achieved && <span className="ml-1">🌟</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
