import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { collection, onSnapshot, doc, setDoc, addDoc, query, orderBy, updateDoc } from "firebase/firestore";
import { auth, db } from '../lib/firebase';

import ActivityHeatmap from '../components/ActivityHeatmap';
import LessonTracker from '../components/LessonTracker';
import Checklist from '../components/Checklist';

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [dailyData, setDailyData] = useState({});
  const [lessons, setLessons] = useState([]);

  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch(error => console.error("Anonymous sign-in failed:", error));
      }
    });
  }, []);

  const getDailyDataCollectionPath = useCallback(() => `artifacts/${appId}/users/${userId}/korean_tracker_data`, [appId, userId]);
  const getLessonsCollectionPath = useCallback(() => `artifacts/${appId}/users/${userId}/korean_tracker_lessons`, [appId, userId]);

  useEffect(() => {
    if (!userId) return;
    const unsubscribeDailyData = onSnapshot(collection(db, getDailyDataCollectionPath()), (snapshot) => {
      const data = {};
      snapshot.forEach(doc => { data[doc.id] = doc.data(); });
      setDailyData(data);
    });

    const unsubscribeLessons = onSnapshot(query(collection(db, getLessonsCollectionPath()), orderBy("date")), (snapshot) => {
      const lessonData = [];
      snapshot.forEach(doc => { lessonData.push({ id: doc.id, ...doc.data() }); });
      setLessons(lessonData);
    });

    return () => {
      unsubscribeDailyData();
      unsubscribeLessons();
    };
  }, [userId, getDailyDataCollectionPath, getLessonsCollectionPath]);

  const handleChecklistItem = async (itemId, isChecked) => {
    if (!userId) return;
    const getFormattedDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayKey = getFormattedDate(new Date());
    const todayData = dailyData[todayKey] || { completed: [] };
    let updatedCompleted = [...todayData.completed];

    if (isChecked) {
      if (!updatedCompleted.includes(itemId)) updatedCompleted.push(itemId);
    } else {
      updatedCompleted = updatedCompleted.filter(id => id !== itemId);
    }
    await setDoc(doc(db, getDailyDataCollectionPath(), todayKey), { completed: updatedCompleted }, { merge: true });
  };

  const handleAddLesson = async (date) => {
    if (!userId) return;
    await addDoc(collection(db, getLessonsCollectionPath()), { date: date.toISOString() });
  };

  const handleUpdateLesson = async (id, date) => {
    if (!userId) return;
    await updateDoc(doc(db, getLessonsCollectionPath(), id), { date: date.toISOString() });
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