import { useState, useEffect, useMemo } from 'react';

export default function ActivityHeatmap({ dailyData }) {
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    let longestStreak = 0, currentStreak = 0;
    const getFormattedDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const sortedDates = Object.keys(dailyData).filter(key => dailyData[key].completed.length > 0).sort();
    if (sortedDates.length > 0) {
        let tempStreak = 1; longestStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const diff = (new Date(sortedDates[i]) - new Date(sortedDates[i-1])) / 86400000;
            if (diff === 1) tempStreak++; else { longestStreak = Math.max(longestStreak, tempStreak); tempStreak = 1; }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
    }
    let streak = 0; let checkDate = new Date();
    if (!dailyData[getFormattedDate(checkDate)] || dailyData[getFormattedDate(checkDate)].completed.length === 0) checkDate.setDate(checkDate.getDate() - 1);
    while(true) { const key = getFormattedDate(checkDate); if(dailyData[key] && dailyData[key].completed.length > 0) { streak++; checkDate.setDate(checkDate.getDate() - 1); } else break; }
    currentStreak = streak;
    
    setStreaks(prev => {
        if (prev.current !== currentStreak || prev.longest !== longestStreak) {
            document.getElementById('longest-streak')?.classList.add('updating');
            document.getElementById('current-streak')?.classList.add('updating');
            setTimeout(() => {
                document.getElementById('longest-streak')?.classList.remove('updating');
                document.getElementById('current-streak')?.classList.remove('updating');
            }, 300);
        }
        return { current: currentStreak, longest: longestStreak };
    });
  }, [dailyData]);

  const { heatmapWeeks, monthLabels } = useMemo(() => {
    const HEATMAP_MONTHS_AGO = 6, HEATMAP_MONTHS_AHEAD = 1;
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + HEATMAP_MONTHS_AHEAD, 0);
    const startDate = new Date(today.getFullYear(), today.getMonth() - HEATMAP_MONTHS_AGO, 1);
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    let weeks = [], week = new Array(7).fill(null), monthLabelData = [], currentMonth = -1, weekCountForMonth = 0;
    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 && week.some(d => d)) { weeks.push(week); week = new Array(7).fill(null); if (currentMonth !== -1) weekCountForMonth++; }
        if (currentDate >= startDate) {
            week[currentDate.getDay()] = new Date(currentDate);
            if (currentDate.getMonth() !== currentMonth) {
                if (currentMonth !== -1) monthLabelData[monthLabelData.length - 1].weeks = weekCountForMonth;
                currentMonth = currentDate.getMonth(); monthLabelData.push({ month: currentMonth, weeks: 0 }); weekCountForMonth = 0;
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
    if (monthLabelData.length > 0) monthLabelData[monthLabelData.length - 1].weeks = weekCountForMonth + 1;
    return { heatmapWeeks: weeks, monthLabels: monthLabelData };
  }, [dailyData]);

  useEffect(() => {
    const todayCell = document.getElementById('today-cell');
    if (todayCell) { const scrollContainer = document.getElementById('heatmap-carousel'); scrollContainer.scrollTo({ left: todayCell.closest('.grid').offsetLeft - scrollContainer.offsetWidth / 2 + todayCell.offsetWidth / 2, behavior: 'smooth' }); }
  }, [heatmapWeeks]);

  const getColorClass = (c) => { if (c === 0) return 'bg-slate-200'; if (c === 1) return 'bg-teal-200'; if (c === 2) return 'bg-teal-400'; if (c === 3) return 'bg-teal-600'; if (c >= 4) return 'bg-teal-800'; return 'bg-slate-200'; };
  const getFormattedDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Activity</h2>
        <div className="grid grid-cols-2 gap-4 text-right">
          <div>
            <p className="text-sm text-slate-500">Longest Streak</p>
            <p className="text-xl font-semibold text-slate-800"><span id="longest-streak" className="streak-value">{streaks.longest}</span> days</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Current Streak</p>
            <p className="text-xl font-semibold text-teal-600"><span id="current-streak" className="streak-value">{streaks.current}</span> days</p>
          </div>
        </div>
      </div>
      <div id="activity-graph">
        <div id="month-labels-container" className="overflow-hidden pl-10">
          <div id="month-labels" className="flex">
            {monthLabels.map((data, i) => (
              <div key={i} className="text-xs text-slate-500 shrink-0" style={{ width: `${data.weeks * 1.5}rem` }}>
                {new Date(new Date().getFullYear(), data.month).toLocaleString('default', { month: 'short' })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="grid grid-rows-7 gap-2 text-xs text-slate-500 mt-1 shrink-0">
            <div className="h-4"></div><div className="h-4 flex items-center">Mon</div><div className="h-4"></div>
            <div className="h-4 flex items-center">Wed</div><div className="h-4"></div><div className="h-4 flex items-center">Fri</div><div className="h-4"></div>
          </div>
          <div className="fade-container flex-grow">
            <div id="heatmap-carousel" className="heatmap-carousel py-1">
              <div id="heatmap" className="flex gap-2">
                {heatmapWeeks.map((week, i) => (
                  <div key={i} className="grid grid-rows-7 gap-2">
                    {week.map((day, j) => {
                      if (!day) return <div key={j} className="w-4 h-4"></div>;
                      const dateKey = getFormattedDate(day);
                      const dayData = dailyData[dateKey];
                      const completedCount = dayData ? dayData.completed.length : 0;
                      return (
                        <div key={j} className="relative has-tooltip">
                          <div className={`heatmap-cell w-4 h-4 rounded-sm ${getColorClass(completedCount)} ${dateKey === getFormattedDate(new Date()) ? 'ring-2 ring-teal-500' : ''}`} id={dateKey === getFormattedDate(new Date()) ? 'today-cell' : ''}></div>
                          <div className="tooltip absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2 left-1/2">{`${completedCount} tasks on ${day.toLocaleDateString()}`}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2 text-sm text-slate-500">
        <span>Less</span><div className="w-3 h-3 rounded-sm bg-slate-200"></div><div className="w-3 h-3 rounded-sm bg-teal-200"></div>
        <div className="w-3 h-3 rounded-sm bg-teal-400"></div><div className="w-3 h-3 rounded-sm bg-teal-600"></div><div className="w-3 h-3 rounded-sm bg-teal-800"></div><span>More</span>
      </div>
    </div>
  );
}