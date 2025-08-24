export default function Checklist({ dailyData, onCheckItem }) {
  const checklistItems = [
    { id: 'immersion', text: 'Immersion (Podcast/Film)' },
    { id: 'ttmik', text: 'Study (TTMIK)' },
    { id: 'grammar', text: 'Practice Grammar' },
    { id: 'anki', text: 'Anki Review' }
  ];

  const getFormattedDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayKey = getFormattedDate(new Date());
  const todayData = dailyData[todayKey] || { completed: [] };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-5 text-slate-800">Today's Progress</h2>
      <div id="checklist" className="space-y-1">
        {checklistItems.map(item => {
          const isChecked = todayData.completed.includes(item.id);
          return (
            <label key={item.id} className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-teal-50/50 transition-colors group">
              <input 
                type="checkbox" 
                data-id={item.id} 
                className="custom-checkbox" 
                checked={isChecked}
                onChange={(e) => onCheckItem(item.id, e.target.checked)}
              />
              <span className="ml-4 text-slate-700 group-hover:text-slate-900 transition-colors">{item.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}