import 'remixicon/fonts/remixicon.css'
import { useState, useEffect } from 'react';
import { User, Activity } from './types';
import { getUser, getActivities, saveUser, resetAllData } from './utils/storage';
import Onboarding from './components/Onboarding';
import ActivityLogger from './components/ActivityLogger';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Achievements from './components/Achievements';
import { getStreak, getBadges, updateStreakAndBadges, resetAchievements } from './utils/achievements';
import { Sun, Moon, LogOut } from 'lucide-react';
import Modal from './components/Modal';
import ChatBot from './components/ChatBot';

function getTodayEmissions(activities: Activity[]): number {
  const today = new Date().toLocaleDateString();
  return activities.filter(a => new Date(a.date).toLocaleDateString() === today)
    .reduce((sum, a) => sum + a.co2Emissions, 0);
}

function getYesterdayEmissions(activities: Activity[]): number {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStr = yesterday.toLocaleDateString();
  return activities.filter(a => new Date(a.date).toLocaleDateString() === yestStr)
    .reduce((sum, a) => sum + a.co2Emissions, 0);
}

function App() {
  const [user, setUser] = useState<User | null>(getUser());
  const [activities, setActivities] = useState<Activity[]>(getActivities());
  const [isDark, setIsDark] = useState(false);
  const [streak, setStreak] = useState(getStreak());
  const [badges, setBadges] = useState(getBadges());
  const [showSummary, setShowSummary] = useState(false);
  const [summaryMsg, setSummaryMsg] = useState('');

  useEffect(() => {
    if (user?.theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, [user]);

  useEffect(() => {
    const { streak, badges } = updateStreakAndBadges(activities);
    setStreak(streak);
    setBadges(badges);
  }, [activities]);

  const handleOnboarding = (userData: User) => {
    saveUser(userData);
    setUser(userData);
  };

  const handleActivityUpdate = () => {
    setActivities(getActivities());
    // Calculate daily summary
    const all = getActivities();
    const today = getTodayEmissions(all);
    const yesterday = getYesterdayEmissions(all);
    let msg = `You added ${today.toFixed(2)} kg CO₂ today`;
    if (yesterday > 0) {
      const diff = today - yesterday;
      const percent = Math.abs(diff) / yesterday * 100;
      if (diff < 0) msg += ` — that's ${percent.toFixed(0)}% less than yesterday. Keep it up!`;
      else if (diff > 0) msg += ` — that's ${percent.toFixed(0)}% more than yesterday. Try to improve!`;
      else msg += ` — same as yesterday!`;
    }
    setSummaryMsg(msg);
    setShowSummary(true);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    if (user) {
      const updatedUser = { ...user, theme: newTheme as 'light' | 'dark' };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetAllData();
      resetAchievements();
      setUser(null);
      setActivities([]);
      setStreak(getStreak());
      setBadges(getBadges());
    }
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900/95 transition-colors duration-200 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col">
          <header className="card rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">{user.goal}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="btn-icon rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition">
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-500" />
                  )}
                </button>
                <button onClick={handleReset} className="btn-icon rounded-full p-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition">
                  <LogOut className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-8">
              <Achievements streak={streak} badges={badges} />
              <Dashboard
                activities={activities}
                onActivityDeleted={handleActivityUpdate}
              />
            </div>
            <div className="space-y-4 sm:space-y-8">
              <ActivityLogger onActivityAdded={handleActivityUpdate} />
              <Insights activities={activities} />
            </div>
          </div>
        </div>
        <Modal open={showSummary} onClose={() => setShowSummary(false)}>
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Daily Summary</div>
            <div className="text-gray-700 dark:text-gray-200">{summaryMsg}</div>
          </div>
        </Modal>
      </div>
      {/* <ChatBot /> */}
    </div>
  );
}

export default App;