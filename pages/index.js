import { useState, useEffect } from 'react';
import Head from 'next/head';
import ActivityHeatmap from '../components/ActivityHeatmap';
import LessonTracker from '../components/LessonTracker';
import Checklist from '../components/Checklist';

export default function Home() {
  const [dailyData, setDailyData] = useState({});
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    // Fetch initial data from our API
    const fetchData = async () => {
      try {
        const dailyDataRes = await fetch('/api/daily-data');
        const lessonsRes = await fetch('/api/lessons');
        const dailyDataJson = await dailyDataRes.json();
        let lessonsJson = await lessonsRes.json();
        // Defensive: ensure lessonsJson is always an array
        if (!Array.isArray(lessonsJson)) lessonsJson = [];
        setDailyData(dailyDataJson);
        setLessons(lessonsJson);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLessons([]); // fallback to empty array
      }
    };
    fetchData();
  }, []);

  const handleChecklistItem = async (itemId, isChecked) => {
    const getFormattedDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayKey = getFormattedDate(new Date());
    
    const currentCompleted = dailyData[todayKey]?.completed || [];
    let updatedCompleted = [...currentCompleted];

    if (isChecked) {
      if (!updatedCompleted.includes(itemId)) updatedCompleted.push(itemId);
    } else {
      updatedCompleted = updatedCompleted.filter(id => id !== itemId);
    }

    // Optimistically update UI
    setDailyData(prev => ({ ...prev, [todayKey]: { completed: updatedCompleted } }));

    // Send update to API
    await fetch(`/api/daily-data/${todayKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: updatedCompleted }),
    });
  };

  const handleAddLesson = async (date) => {
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    const newLesson = await res.json();
    setLessons(prev => [...prev, newLesson].sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  const handleUpdateLesson = async (id, date) => {
    const res = await fetch(`/api/lessons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    const updatedLesson = await res.json();
    setLessons(prev => prev.map(l => l.id === id ? updatedLesson : l).sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  return (
    <>
      <Head>
        <title>Korean Language Progress Tracker</title>
        <meta name="description" content="Track your Korean language learning progress" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">한국어 학습</h1>
          <p className="text-slate-500 mt-1 text-lg">Korean Language Progress Tracker</p>
        </header>
        <main className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <Checklist dailyData={dailyData} onCheckItem={handleChecklistItem} />
            <LessonTracker lessons={lessons} onAddLesson={handleAddLesson} onUpdateLesson={handleUpdateLesson} />
          </div>
          <ActivityHeatmap dailyData={dailyData} />
        </main>
      </div>
    </>
  );
}