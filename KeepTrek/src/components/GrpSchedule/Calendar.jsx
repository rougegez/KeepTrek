// Calendar.jsx
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({
  currentDate,
  setCurrentDate,
  selectedDates,
  setSelectedDates,
  handleSubmit,
  readOnly = false,
  highlightRange = null,
  showControls = true,
  compact = false,
  loading = false, // loading state passed from parent
}) => {
  const isDragging = useRef(false);
  const [opacity, setOpacity] = useState(0);

  // Delay fade-in so the transition is visible.
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Format a day number into YYYY-MM-DD.
  const formatDate = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  // Format a Date object into YYYY-MM-DD.
  const formatDateObj = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Generate a calendar grid for the current month.
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
    const calendar = [];
    // Fill empty slots before the first day.
    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }
    // Add each day of the month.
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    return calendar;
  };

  // If in readOnly mode with a highlightRange, compute which dates to highlight.
  let highlightedDates = new Set();
  if (readOnly && highlightRange && highlightRange.start_date && highlightRange.end_date) {
    const start = new Date(highlightRange.start_date);
    const end = new Date(highlightRange.end_date);
    const iter = new Date(start);
    while (iter <= end) {
      if (
        iter.getFullYear() === currentDate.getFullYear() &&
        iter.getMonth() === currentDate.getMonth()
      ) {
        highlightedDates.add(formatDateObj(iter));
      }
      iter.setDate(iter.getDate() + 1);
    }
  }

  // Toggle date selection (only if not in readOnly mode).
  const handleDateSelect = (day) => {
    if (day === null) return;
    const formattedDate = formatDate(day);
    // Custom logic: use setSelectedDates updater to control selection behavior.
    setSelectedDates((prev) => {
      const newSelectedDates = new Set(prev);
      // If the clicked date is already selected, reset selection to just that date.
      if (newSelectedDates.has(formattedDate)) {
        return new Set([formattedDate]);
      } else {
        // If no date is selected yet, simply add this date.
        if (newSelectedDates.size === 0) {
          newSelectedDates.add(formattedDate);
          return newSelectedDates;
        }
        // If exactly one date is already selected, autofill the range.
        if (newSelectedDates.size === 1) {
          const existing = Array.from(newSelectedDates)[0];
          let start = new Date(existing);
          let end = new Date(formattedDate);
          // Ensure start is before end.
          if (start > end) {
            [start, end] = [end, start];
          }
          const filled = new Set();
          let current = new Date(start);
          while (current <= end) {
            filled.add(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
          }
          return filled;
        }
        // If more than one date is already selected, reset to this date.
        return new Set([formattedDate]);
      }
    });
  };


  // Handlers for dragging selection (only in interactive mode).
  const handleDragStart = (day) => (e) => {
    if (readOnly) return;
    e.preventDefault();
    if (day === null) return;
    isDragging.current = true;
    handleDateSelect(day);
  };

  const handleDragEnter = (day) => () => {
    if (readOnly) return;
    if (isDragging.current && day !== null) {
      handleDateSelect(day);
    }
  };

  const handleDragEnd = () => {
    if (readOnly) return;
    isDragging.current = false;
  };

  // Navigation handlers for month switching.
  const handleNext = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev);
      nextDate.setMonth(prev.getMonth() + 1);
      return nextDate;
    });
  };

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const prevDate = new Date(prev);
      prevDate.setMonth(prev.getMonth() - 1);
      return prevDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    if (!readOnly) {
      const handleMouseUpGlobal = () => {
        if (isDragging.current) {
          handleDragEnd();
        }
      };
      window.addEventListener("mouseup", handleMouseUpGlobal);
      return () => {
        window.removeEventListener("mouseup", handleMouseUpGlobal);
      };
    }
  }, [readOnly]);

  return (
    <div style={{ transition: "opacity 0.5s ease", opacity }}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevious} className="p-2">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-medium">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={handleNext} className="p-2">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {generateCalendar().map((day, index) => {
          const formattedDate = day ? formatDate(day) : "";
          const isMarked = readOnly
            ? highlightedDates.has(formattedDate)
            : selectedDates.has(formattedDate);
          const sizeClass = "w-10 h-10"; // Fixed size for day buttons.
          return (
            <button
              key={index}
              onMouseDown={!readOnly ? handleDragStart(day) : undefined}
              onMouseEnter={!readOnly ? handleDragEnter(day) : undefined}
              onMouseUp={!readOnly ? handleDragEnd : undefined}
              disabled={day === null}
              className={`${sizeClass} rounded-md text-sm flex items-center justify-center ${
                day
                  ? readOnly
                    ? "cursor-default"
                    : "cursor-pointer hover:bg-primary/10"
                  : "text-muted-foreground cursor-not-allowed"
              } ${isMarked ? "bg-primary text-primary-foreground" : ""}`}
            >
              {day || ""}
            </button>
          );
        })}
      </div>
      {!readOnly && showControls && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 border rounded text-white hover:opacity-80"
            style={{ backgroundColor: "#4DB6AC" }}
            onClick={handleToday}
          >
            Today
          </button>
          <button
            className="px-4 py-2 border rounded text-white hover:opacity-80 disabled:bg-gray-400"
            style={{ backgroundColor: "#4DB6AC" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {/* Fixed-width container to maintain button size */}
            <span className="inline-flex items-center justify-center w-16">
              {loading ? "Updating..." : "Submit"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
