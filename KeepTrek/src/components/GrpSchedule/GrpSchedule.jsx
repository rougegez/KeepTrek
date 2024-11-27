// src/components/GrpSchedule/GrpSchedule.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersonIcon } from "@primer/octicons-react";
import KeepTrek from "../../assets/KeepTrek.png";
import "./GrpSchedule.css";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const GrpSchedule = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date in view
  const [selectedSlots, setSelectedSlots] = useState([]); // For weekly view
  const [selectedDates, setSelectedDates] = useState([]); // For monthly view
  const [viewMode, setViewMode] = useState("monthly"); // Show monthly view first
  const isDragging = useRef(false); // Track if the user is dragging
  const dragMode = useRef(null); // Track whether we are selecting or deselecting
  const calendarContainerRef = useRef(null); // Reference for the scrollable calendar container
  const initialDragDate = useRef(null); // For monthly view drag start date
  const initialSelectedDates = useRef([]); // For monthly view initial selected dates

  // Helper function to format date as 'YYYY-MM-DD' using local time
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Scroll the calendar to show 18.5:00 initially in weekly view
  useEffect(() => {
    if (viewMode === "weekly" && calendarContainerRef.current) {
      const hourHeight = 50;
      const noonScrollPosition = hourHeight * 18.5; // Adjusted to 18.5:00 PM
      calendarContainerRef.current.scrollTop = noonScrollPosition;
    }
  }, [viewMode]);

  // Helper to get start of the week (Monday)
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  // Helper to get the first day of the month
  const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Helper to get the last day of the month
  const getEndOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Generate the current week days for weekly view
  const getCurrentWeekDays = () => {
    const currentWeek = [];
    const startOfWeek = getStartOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      currentWeek.push(day);
    }
    return currentWeek;
  };

  // Generate the current month's days for monthly view
  const getCurrentMonthDays = () => {
    const currentMonth = [];
    const startOfMonth = getStartOfMonth(currentDate);
    const endOfMonth = getEndOfMonth(currentDate);
    let currentDay = new Date(startOfMonth);

    while (currentDay <= endOfMonth) {
      currentMonth.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return currentMonth;
  };

  const weekDays = getCurrentWeekDays();
  const monthDays = getCurrentMonthDays();

  const currentMonth = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Handle date selection or drag in monthly view
  const handleDateSelection = (day) => {
    const date = formatDate(day);
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((s) => s !== date)); // Deselect
    } else {
      setSelectedDates([...selectedDates, date]); // Select
    }
  };

  // Mouse events for monthly view
  const handleDateMouseDown = (day) => {
    const date = formatDate(day);
    dragMode.current = selectedDates.includes(date) ? "deselect" : "select";
    isDragging.current = true;
    initialDragDate.current = day;
    initialSelectedDates.current = [...selectedDates]; // Save the initial selected dates
    handleDateSelection(day);
    document.body.classList.add("dragging"); // Add the class when dragging starts
  };

  const handleDateMouseOver = (day) => {
    if (isDragging.current) {
      const startDate = initialDragDate.current;
      const endDate = day;

      const datesInRange = getDatesBetween(
        new Date(startDate.toDateString()),
        new Date(endDate.toDateString())
      ).map((date) => formatDate(date));

      if (dragMode.current === "select") {
        // Combine initialSelectedDates with datesInRange
        setSelectedDates(
          Array.from(
            new Set([...initialSelectedDates.current, ...datesInRange])
          )
        );
      } else if (dragMode.current === "deselect") {
        // Remove datesInRange from initialSelectedDates
        setSelectedDates(
          initialSelectedDates.current.filter(
            (date) => !datesInRange.includes(date)
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragMode.current = null;
    document.body.classList.remove("dragging"); // Remove the class when dragging ends
    initialDragDate.current = null;
    initialSelectedDates.current = [];
  };

  const handleClearAll = () => {
    setSelectedSlots([]);
    setSelectedDates([]);
  };

  const handlePreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "weekly") {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "weekly") {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const generateHourlyIntervals = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, "0");
      hours.push(time);
    }
    return hours;
  };

  const hourlyIntervals = generateHourlyIntervals();

  const generateTimeRanges = (hour) => {
    const ranges = [
      `${hour}:00-${hour}:15`,
      `${hour}:15-${hour}:30`,
      `${hour}:30-${hour}:45`,
      `${hour}:45-${(parseInt(hour) + 1).toString().padStart(2, "0`")}:00`,
    ];
    return ranges;
  };

  return (
    <>
    <SidebarProvider>
    <AppSidebar />
    <SidebarTrigger />

      {/* Main Content */}
      <div
        className="grp-content"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Toggle between Week and Month */}
        <div className="view-toggle-container">
          <div className="calendar-nav-left">
            <button
              onClick={handlePreviousPeriod}
              className="calendar-nav-button"
            >
              &lt; Previous
            </button>
            <button onClick={handleToday} className="calendar-nav-button">
              Today
            </button>
            <button onClick={handleNextPeriod} className="calendar-nav-button">
              Next &gt;
            </button>
          </div>

          <div className="calendar-month-header">{currentMonth}</div>

          <div className="view-toggle-buttons">
            <button
              className={`view-toggle ${
                viewMode === "monthly" ? "active" : ""
              }`}
              onClick={() => setViewMode("monthly")}
            >
              Month
            </button>
            <button
              className={`view-toggle ${viewMode === "weekly" ? "active" : ""}`}
              onClick={() => setViewMode("weekly")}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "weekly" ? (
          <div className="scrollable-calendar" ref={calendarContainerRef}>
            <div className="calendar-grid">
              <div className="calendar-header">
                <div className="time-slot-header"></div>
                {weekDays.map((day, index) => (
                  <div key={index} className="day-header">
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </div>
                ))}
              </div>

              <div className="calendar-body">
                {hourlyIntervals.map((hour, timeIndex) => (
                  <div key={timeIndex} className="time-row">
                    <div className="time-slot">{hour}:00</div>
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="hour-slot">
                        {generateTimeRanges(hour).map((timeRange) => {
                          const isSelected = selectedSlots.includes(
                            `${formatDate(day)} ${timeRange}`
                          );
                          return (
                            <div
                              key={timeRange}
                              className={`slot ${isSelected ? "selected" : ""}`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="monthly-view">
            <div className="calendar-month-grid">
              {monthDays.map((day, index) => {
                const date = formatDate(day);
                const isSelected = selectedDates.includes(date);
                return (
                  <div
                    key={index}
                    className={`month-day ${isSelected ? "selected" : ""}`}
                    onMouseDown={() => handleDateMouseDown(day)}
                    onMouseOver={() => handleDateMouseOver(day)}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="btn-group">
          <button className="btn-primary" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </div>
      </SidebarProvider>
    </>
  );
};
