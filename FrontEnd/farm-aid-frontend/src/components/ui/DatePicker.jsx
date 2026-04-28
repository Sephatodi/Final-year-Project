import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DatePicker = ({ 
  value, 
  onChange, 
  minDate, 
  maxDate,
  placeholder = 'Select date',
  disabled = false,
  format = 'YYYY-MM-DD',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const containerRef = useRef(null);
  const calendarRef = useRef(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
          containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(newDate)) {
      setSelectedDate(newDate);
      onChange(formatDate(newDate));
      setIsOpen(false);
    }
  };

  const changeMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today.getDate());
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();
      const isToday = new Date().toDateString() === date.toDateString();
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-colors
            ${isSelected ? 'bg-primary text-white' : ''}
            ${isToday && !isSelected ? 'border border-primary text-primary' : ''}
            ${!isSelected && !isToday && !disabled ? 'hover:bg-sage-100 dark:hover:bg-sage-800' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed text-sage-400' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input Field */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2 rounded-lg border border-sage-200 dark:border-sage-800 
          bg-white dark:bg-sage-900 cursor-pointer flex items-center gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
        `}
      >
        <span className="material-icons-outlined text-sage-400">calendar_today</span>
        <span className={`flex-1 ${!value ? 'text-sage-400' : ''}`}>
          {value ? new Date(value).toLocaleDateString() : placeholder}
        </span>
        <span className="material-icons-outlined text-sage-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && createPortal(
        <div
          ref={calendarRef}
          className="absolute z-50 mt-1 p-4 bg-white dark:bg-sage-900 rounded-lg shadow-lg border border-sage-200 dark:border-sage-800 w-80"
          style={{
            top: containerRef.current?.getBoundingClientRect().bottom + window.scrollY,
            left: containerRef.current?.getBoundingClientRect().left,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-sage-100 dark:hover:bg-sage-800 rounded"
            >
              <span className="material-icons-outlined">chevron_left</span>
            </button>
            <div className="font-medium">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-sage-100 dark:hover:bg-sage-800 rounded"
            >
              <span className="material-icons-outlined">chevron_right</span>
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(day => (
              <div key={day} className="w-10 h-10 flex items-center justify-center text-xs font-medium text-sage-500">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-800 flex justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-sage-500 hover:text-sage-700"
            >
              Cancel
            </button>
            <button
              onClick={goToToday}
              className="text-sm text-primary hover:underline"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  className: PropTypes.string,
};

export default DatePicker;