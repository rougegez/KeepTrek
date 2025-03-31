// AutoFillCalendar.jsx
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AutoFillCalendar = ({
  currentDate,
  setCurrentDate,
  selectedDates,
  setSelectedDates,
  // For AvailableTrips, no handleSubmit and showControls are needed.
  readOnly = false,
  compact = false,
}) => {
  const isDragging = useRef(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const formatDateObj = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
    const calendar = [];
    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    return calendar;
  };

  // Custom autofill date selection logic:
  // - If no date is selected, add the clicked date.
  // - If one date is selected and the clicked date is not already selected, autofill the range.
  // - If the clicked date is already selected, reset the selection to just that date.
  const handleDateSelect = (day) => {
    if (day === null) return;
    const formattedDate = formatDate(day);
    setSelectedDates((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(formattedDate)) {
        // Reset selection if re-clicking an already-selected date.
        return new Set([formattedDate]);
      } else {
        if (newSelected.size === 0) {
          newSelected.add(formattedDate);
          return newSelected;
        }
        if (newSelected.size === 1) {
          const existing = Array.from(newSelected)[0];
          let start = new Date(existing);
          let end = new Date(formattedDate);
          if (start > end) [start, end] = [end, start];
          const filled = new Set();
          let current = new Date(start);
          while (current <= end) {
            filled.add(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
          }
          return filled;
        }
        // If more than one date is already selected, reset to clicked date.
        return new Set([formattedDate]);
      }
    });
  };

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

  const handleNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  };

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const prevDate = new Date(prev);
      prevDate.setMonth(prevDate.getMonth() - 1);
      return prevDate;
    });
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
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button onClick={handleNext} className="p-2">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {generateCalendar().map((day, index) => {
          const formattedDate = day ? formatDate(day) : "";
          const isMarked = selectedDates.has(formattedDate);
          const sizeClass = "w-10 h-10";
          return (
            <button
              key={index}
              onMouseDown={!readOnly ? handleDragStart(day) : undefined}
              onMouseEnter={!readOnly ? handleDragEnter(day) : undefined}
              onMouseUp={!readOnly ? handleDragEnd : undefined}
              disabled={day === null}
              className={`${sizeClass} rounded-md text-sm flex items-center justify-center ${
                day ? "cursor-pointer hover:bg-primary/10" : "text-muted-foreground cursor-not-allowed"
              } ${isMarked ? "bg-primary text-primary-foreground" : ""}`}
            >
              {day || ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AutoFillCalendar;
