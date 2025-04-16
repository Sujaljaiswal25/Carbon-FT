// import React from 'react';
import { Activity } from '../types';
import { Trash2 } from 'lucide-react';
import { deleteActivity } from '../utils/storage';
import {
  PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart as ReLineChart, Line
} from 'recharts';
import { EMISSION_FACTORS } from '../types';

const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171'];

const CATEGORY_LIST = Array.from(new Set(EMISSION_FACTORS.map(f => f.category)));

interface DashboardProps {
  activities: Activity[];
  onActivityDeleted: () => void;
}

// Utility to get all dates between two dates (inclusive)
function getDateRange(start: Date, end: Date): string[] {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(current.toLocaleDateString());
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Format date as 'MMM dd' for chart axis
function formatChartDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function Dashboard({ activities, onActivityDeleted }: DashboardProps) {
  const getTotalEmissions = () => {
    return activities.reduce((sum, activity) => sum + activity.co2Emissions, 0);
  };

  const getCategoryPieData = (activities: Activity[]) => {
    // Ensure all categories are represented
    const byCat = activities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.co2Emissions;
      return acc;
    }, {} as Record<string, number>);
    const total = Object.values(byCat).reduce((a, b) => a + b, 0);
    return CATEGORY_LIST.map((cat, i) => {
      const value = byCat[cat] || 0;
      return {
        name: cat,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[i % COLORS.length],
      };
    });
  };

  const getDailyBarData = (activities: Activity[]) => {
    if (activities.length === 0) return [];
    const sorted = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const start = new Date(sorted[0].date);
    const end = new Date(sorted[sorted.length - 1].date);
    const allDates = getDateRange(start, end);
    const byDay: Record<string, number> = {};
    activities.forEach(a => {
      const d = new Date(a.date).toLocaleDateString();
      byDay[d] = (byDay[d] || 0) + a.co2Emissions;
    });
    return allDates.map(date => ({ date: formatChartDate(date), value: byDay[date] || 0 }));
  };

  const getLineData = (activities: Activity[]) => {
    if (activities.length === 0) return [];
    const sorted = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const start = new Date(sorted[0].date);
    const end = new Date(sorted[sorted.length - 1].date);
    const allDates = getDateRange(start, end);
    const byDay: Record<string, number> = {};
    activities.forEach(a => {
      const d = new Date(a.date).toLocaleDateString();
      byDay[d] = (byDay[d] || 0) + a.co2Emissions;
    });
    let total = 0;
    return allDates.map(date => {
      total += byDay[date] || 0;
      return { date: formatChartDate(date), total };
    });
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
    onActivityDeleted();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h2a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2a2 2 0 012-2z" /></svg>
            <h2 className="text-xl font-semibold">Total Emissions</h2>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {getTotalEmissions().toFixed(2)} kg CO2
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0v1m0 0v1" /></svg>
            <h2 className="text-xl font-semibold">% by Category</h2>
          </div>
          <div className="h-48 w-full flex flex-col items-center justify-center">
            {activities.length === 0 || getCategoryPieData(activities).every(d => d.value === 0) ? (
              <div className="text-gray-400 text-center">No emission data to display.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={getCategoryPieData(activities)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={({ name, percent, value }) => value > 0 && percent > 0 ? `${name}: ${percent.toFixed(0)}%` : ''}
                  >
                    {getCategoryPieData(activities).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip formatter={(value: number, name: string) => [`${value.toFixed(2)} kg`, name]} />
                  <Legend formatter={(value, entry, index) => {
                    const cat = getCategoryPieData(activities).find(d => d.name === value);
                    return <span style={{ color: cat ? cat.color : '#888' }}>{value}</span>;
                  }} />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">Shows the percentage of your total emissions for each category.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Emissions Trend</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={getDailyBarData(activities)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} tickFormatter={formatChartDate} />
                <YAxis fontSize={12} />
                <Bar dataKey="value" fill="#34d399" />
                <ReTooltip />
                <Legend />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">Displays your daily total emissions. Each bar is a day.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={getLineData(activities)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} tickFormatter={formatChartDate} />
                <YAxis fontSize={12} />
                <Line type="monotone" dataKey="total" stroke="#60a5fa" strokeWidth={2} dot={false} />
                <ReTooltip />
                <Legend />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tracks your cumulative emissions over time.</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Activities</h2>
        <div className="space-y-4">
          {activities.slice().reverse().map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="capitalize font-medium">{activity.type}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({activity.category})</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(activity.date)} • {activity.co2Emissions.toFixed(2)} kg CO2
                </div>
              </div>
              <button
                onClick={() => handleDelete(activity.id)}
                className="btn-icon text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No activities logged yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}