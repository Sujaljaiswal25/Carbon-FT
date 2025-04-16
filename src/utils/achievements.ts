import { Activity } from '../types';

const STREAK_KEY = 'ecotrackr_streak';
const BADGES_KEY = 'ecotrackr_badges';

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastDate: string | null;
  lastEmission: number | null;
}

export interface Badge {
  id: string;
  label: string;
  achieved: boolean;
  dateAchieved?: string;
}

export const defaultBadges: Badge[] = [
  { id: '7days', label: 'Logged 7 days in a row', achieved: false },
  { id: '3low', label: 'Reduced emissions for 3 days straight', achieved: false },
];

export function getStreak(): StreakData {
  const data = localStorage.getItem(STREAK_KEY);
  return data ? JSON.parse(data) : { currentStreak: 0, maxStreak: 0, lastDate: null, lastEmission: null };
}

export function saveStreak(streak: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

export function getBadges(): Badge[] {
  const data = localStorage.getItem(BADGES_KEY);
  return data ? JSON.parse(data) : defaultBadges;
}

export function saveBadges(badges: Badge[]) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

export function updateStreakAndBadges(activities: Activity[]): { streak: StreakData; badges: Badge[] } {
  if (activities.length === 0) {
    const emptyStreak = { currentStreak: 0, maxStreak: 0, lastDate: null, lastEmission: null };
    saveStreak(emptyStreak);
    saveBadges(defaultBadges);
    return { streak: emptyStreak, badges: defaultBadges };
  }

  // Sort activities by date (ascending)
  const sorted = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 1;
  let maxStreak = 1;
  let lastDate = sorted[0].date;
  let lastEmission = sorted[0].co2Emissions;
  let lowEmissionStreak = 1;
  let maxLowEmissionStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak++;
      if (sorted[i].co2Emissions < lastEmission) {
        lowEmissionStreak++;
        maxLowEmissionStreak = Math.max(maxLowEmissionStreak, lowEmissionStreak);
      } else {
        lowEmissionStreak = 1;
      }
    } else if (diffDays > 1) {
      currentStreak = 1;
      lowEmissionStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
    lastDate = sorted[i].date;
    lastEmission = sorted[i].co2Emissions;
  }

  const streakData: StreakData = { currentStreak, maxStreak, lastDate, lastEmission };
  saveStreak(streakData);

  // Badges
  const badges = getBadges().map(b => ({ ...b }));
  const today = new Date().toISOString();
  if (currentStreak >= 7) {
    const badge = badges.find(b => b.id === '7days');
    if (badge && !badge.achieved) {
      badge.achieved = true;
      badge.dateAchieved = today;
    }
  }
  if (maxLowEmissionStreak >= 3) {
    const badge = badges.find(b => b.id === '3low');
    if (badge && !badge.achieved) {
      badge.achieved = true;
      badge.dateAchieved = today;
    }
  }
  saveBadges(badges);

  return { streak: streakData, badges };
}

export function resetAchievements() {
  localStorage.removeItem(STREAK_KEY);
  localStorage.removeItem(BADGES_KEY);
}
