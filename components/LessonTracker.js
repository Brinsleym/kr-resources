import { useState, useEffect } from 'react';
import DatePicker from './DatePicker';

export default function LessonTracker({ lessons, onAddLesson, onUpdateLesson }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const now = new Date();
    const pastLessons = lessons.filter(l => new Date(l.date) < now);
    const futureLessons = lessons.filter(l => new Date(l.date) >= now);
    setCompletedCount(pastLessons.length);
    setNextLesson(futureLessons.length > 0 ? futureLessons[0] : null);
  }, [lessons]);

  const getCountdownText = () => {
    if (!nextLesson) return 'Schedule a lesson';
    const diff = new Date(nextLesson.date) - new Date();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 1) return `${days} days`;
    if (days === 1) return `1 day`;
    if (hours > 1) return `${hours} hours`;
    if (hours === 1) return `1 hour`;
    return 'Soon!';
  };
  
  const formatFullDate = (d) => {
    const date = new Date(d);
    const s = (day) => { if (day > 3 && day < 21) return 'th'; switch (day % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }};
    return `${date.getDate()}${s(date.getDate())} ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  const handleOk = (date) => {
    if (nextLesson) {
      onUpdateLesson(nextLesson.id, date);
    } else {
      onAddLesson(date);
    }
    setIsPickerOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-5 text-slate-800">Lesson Tracker</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-slate-600">
            <span>Lessons Completed:</span>
            <span id="lessons-completed" className="font-bold text-lg text-slate-800">{completedCount}</span>
          </div>
          <button id="lesson-card" onClick={() => setIsPickerOpen(true)} className="w-full text-center bg-slate-100 p-4 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
            <p className="text-sm text-slate-500">Next Lesson In:</p>
            <p id="next-lesson" className="text-2xl font-bold text-slate-800">{getCountdownText()}</p>
            <p id="next-lesson-date" className="text-sm text-slate-500 italic mt-1 h-5">{nextLesson ? formatFullDate(nextLesson.date) : ''}</p>
          </button>
        </div>
      </div>
      <DatePicker 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)}
        onOk={handleOk}
        initialDate={nextLesson ? new Date(nextLesson.date) : null}
      />
    </>
  );
}