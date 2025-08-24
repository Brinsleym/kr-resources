import { useState, useEffect, useRef } from 'react';

export default function DatePicker({ isOpen, onClose, onOk, initialDate }) {
  const [pickerDate, setPickerDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(11);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isHourPanelOpen, setIsHourPanelOpen] = useState(false);
  const [isMinutePanelOpen, setIsMinutePanelOpen] = useState(false);
  
  const calendarViewRef = useRef(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const date = initialDate ? new Date(initialDate) : new Date();
    if (!initialDate) {
        date.setHours(11, 0, 0, 0);
    }
    setPickerDate(date);
    setSelectedHour(date.getHours());
    setSelectedMinute(date.getMinutes());
  }, [isOpen, initialDate]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    const handleClickOutside = (e) => { if (datePickerRef.current && !datePickerRef.current.contains(e.target)) onClose(); };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const renderCalendar = () => {
    const grid = document.getElementById('datepicker-grid');
    const monthYearEl = document.getElementById('datepicker-month-year');
    if (!grid || !monthYearEl) return;

    grid.innerHTML = '';
    monthYearEl.textContent = pickerDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const year = pickerDate.getFullYear(), month = pickerDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(), daysInMonth = new Date(year, month + 1, 0).getDate();
    ['S','M','T','W','T','F','S'].forEach(d => grid.innerHTML += `<div class="font-bold text-slate-500">${d}</div>`);
    for (let i = 0; i < firstDay; i++) grid.innerHTML += '<div></div>';
    for (let day = 1; day <= daysInMonth; day++) {
      const btn = document.createElement('button');
      btn.className = `p-2 rounded-full hover:bg-teal-100 ${day === pickerDate.getDate() ? 'bg-teal-600 text-white' : ''}`;
      btn.textContent = day;
      btn.onclick = () => setPickerDate(new Date(pickerDate.setDate(day)));
      grid.appendChild(btn);
    }
  };

  useEffect(renderCalendar, [pickerDate, isOpen]); // Rerender when it becomes visible

  const animateMonthChange = (direction) => {
    if (calendarViewRef.current?.classList.contains('is-animating')) return;
    const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    const inClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    calendarViewRef.current?.classList.add('is-animating', outClass);
    calendarViewRef.current?.addEventListener('animationend', () => {
        setPickerDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
        calendarViewRef.current?.classList.remove(outClass);
        calendarViewRef.current?.classList.add(inClass);
        calendarViewRef.current?.addEventListener('animationend', () => {
            calendarViewRef.current?.classList.remove('is-animating', inClass);
        }, { once: true });
    }, { once: true });
  };

  const handleOkClick = () => {
    const finalDate = new Date(pickerDate);
    finalDate.setHours(selectedHour, selectedMinute);
    onOk(finalDate);
  };
  
  const TimePanel = ({ type, selectedValue, onSelect, isOpen, setIsOpen }) => {
    const panelRef = useRef(null);
    const options = type === 'hour' ? Array.from({ length: 24 }, (_, i) => i) : [0, 15, 30, 45];
    
    useEffect(() => {
        if(isOpen) {
            const el = panelRef.current?.querySelector(`[data-value="${selectedValue}"]`);
            if (el) setTimeout(() => el.scrollIntoView({ block: 'center' }), 0);
        }
    }, [isOpen, selectedValue]);

    return (
        <div ref={panelRef} className={`time-select-panel bg-white border rounded shadow-lg ${isOpen ? 'open' : ''}`}>
            {options.map(opt => (
                <div 
                    key={opt}
                    className={`time-select-option text-center cursor-pointer hover:bg-slate-100 ${selectedValue === opt ? 'selected' : ''}`}
                    data-value={opt}
                    onClick={() => { onSelect(opt); setIsOpen(false); }}
                >
                    {String(opt).padStart(2, '0')}
                </div>
            ))}
        </div>
    );
  };

  return (
    <div id="datepicker-modal" className={`datepicker-modal fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'open' : ''}`}>
      <div ref={datePickerRef} className="modal-content bg-white rounded-lg shadow-xl p-6 w-full max-w-sm overflow-hidden">
        <div id="calendar-view" ref={calendarViewRef}>
          <div className="flex justify-between items-center mb-4">
            <button id="datepicker-prev" onClick={() => animateMonthChange('prev')} className="p-2 rounded-full hover:bg-slate-100 datepicker-button">&lt;</button>
            <div id="datepicker-month-year" className="font-semibold"></div>
            <button id="datepicker-next" onClick={() => animateMonthChange('next')} className="p-2 rounded-full hover:bg-slate-100 datepicker-button">&gt;</button>
          </div>
          <div id="datepicker-grid" className="grid grid-cols-7 gap-1 text-center"></div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <label className="text-sm font-medium text-slate-600">Time</label>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="relative">
                <button id="hour-select-trigger" onClick={(e) => { e.stopPropagation(); setIsHourPanelOpen(p => !p); setIsMinutePanelOpen(false); }} className="w-24 p-2 border rounded text-center">{String(selectedHour).padStart(2, '0')}</button>
                <TimePanel type="hour" selectedValue={selectedHour} onSelect={setSelectedHour} isOpen={isHourPanelOpen} setIsOpen={setIsHourPanelOpen} />
            </div>
            <span>:</span>
            <div className="relative">
                <button id="minute-select-trigger" onClick={(e) => { e.stopPropagation(); setIsMinutePanelOpen(p => !p); setIsHourPanelOpen(false); }} className="w-24 p-2 border rounded text-center">{String(selectedMinute).padStart(2, '0')}</button>
                <TimePanel type="minute" selectedValue={selectedMinute} onSelect={setSelectedMinute} isOpen={isMinutePanelOpen} setIsOpen={setIsMinutePanelOpen} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button id="datepicker-cancel" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 datepicker-button">Cancel</button>
          <button id="datepicker-ok" onClick={handleOkClick} className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 datepicker-button">OK</button>
        </div>
      </div>
    </div>
  );
}