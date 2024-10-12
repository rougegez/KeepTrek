import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersonIcon } from "@primer/octicons-react";
import KeepTrek from "../../assets/KeepTrek.png";
import "./GrpSchedule.css";

export const GrpSchedule = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date in view
  const [selectedSlots, setSelectedSlots] = useState([]); // For weekly view
  const [selectedDates, setSelectedDates] = useState([]); // For monthly view
  const [viewMode, setViewMode] = useState("weekly"); // Track whether we are in weekly or monthly view
  const isDragging = useRef(false); // Track if the user is dragging
  const dragMode = useRef(null); // Track whether we are selecting or deselecting
  const calendarContainerRef = useRef(null); // Reference for the scrollable calendar container
  const initialDragDate = useRef(null); // For monthly view drag start date
  const initialSelectedDates = useRef([]); // For monthly view initial selected dates

  // Scroll the calendar to show 12:00 initially in weekly view
  useEffect(() => {
    if (viewMode === "weekly" && calendarContainerRef.current) {
      const hourHeight = 50;
      const noonScrollPosition = hourHeight * 18;
      calendarContainerRef.current.scrollTop = noonScrollPosition;
    }
  }, [viewMode]);

  // Helper to get start of the week (Monday)
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
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

  // Helper function to get dates between two dates
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    const increment = currentDate <= end ? 1 : -1;

    while (true) {
      dates.push(new Date(currentDate));
      if (currentDate.getTime() === end.getTime()) {
        break;
      }
      currentDate.setDate(currentDate.getDate() + increment);
    }
    return dates;
  };

  // Handle slot click or drag for weekly view
  const handleSlotClickOrDrag = (day, timeRange, isDraggingAction = false) => {
    const slot = `${day.toISOString().split("T")[0]} ${timeRange}`;

    if (!isDraggingAction) {
      if (selectedSlots.includes(slot)) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slot));
      } else {
        setSelectedSlots([...selectedSlots, slot]);
      }
    } else {
      if (dragMode.current === "select") {
        if (!selectedSlots.includes(slot)) {
          setSelectedSlots((prev) => [...prev, slot]);
        }
      } else if (dragMode.current === "deselect") {
        setSelectedSlots((prev) => prev.filter((s) => s !== slot));
      }
    }
  };

  // Handle date selection or drag in monthly view
  const handleDateSelection = (day, isDraggingAction = false) => {
    const date = day.toISOString().split("T")[0];

    if (!isDraggingAction) {
      if (selectedDates.includes(date)) {
        setSelectedDates(selectedDates.filter((s) => s !== date)); // Deselect
      } else {
        setSelectedDates([...selectedDates, date]); // Select
      }
    } else {
      // This function is no longer needed since we handle the range selection in handleDateMouseOver
    }
  };

  // Mouse events for monthly view
  const handleDateMouseDown = (day) => {
    const date = day.toISOString().split("T")[0];
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
      ).map((date) => date.toISOString().split("T")[0]);

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

  // Mouse events for weekly view
  const handleMouseDown = (day, timeRange) => {
    const slot = `${day.toISOString().split("T")[0]} ${timeRange}`;
    dragMode.current = selectedSlots.includes(slot) ? "deselect" : "select";
    handleSlotClickOrDrag(day, timeRange);
    isDragging.current = true;
  };

  const handleMouseOver = (day, timeRange) => {
    if (isDragging.current) {
      handleSlotClickOrDrag(day, timeRange, true);
    }
  };

  const preventTextSelection = (event) => {
    event.preventDefault();
  };

  const handleProceed = () => {
    // Combine selectedDates and selectedSlots for output
    const allSelected = [...selectedDates, ...selectedSlots];
    alert(`Selected slots: ${allSelected.join(", ")}`);
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
      `${hour}:45-${(parseInt(hour) + 1).toString().padStart(2, "0")}:00`,
    ];
    return ranges;
  };

  // Handle column selection (date click)
  const handleColumnSelection = (day) => {
    const selectedColumnSlots = hourlyIntervals.flatMap((hour) =>
      generateTimeRanges(hour).map(
        (timeRange) => `${day.toISOString().split("T")[0]} ${timeRange}`
      )
    );

    if (selectedSlots.some((slot) => selectedColumnSlots.includes(slot))) {
      // If any slot in the column is already selected, deselect the entire column
      setSelectedSlots(
        selectedSlots.filter((slot) => !selectedColumnSlots.includes(slot))
      );
    } else {
      // Select the entire column
      setSelectedSlots([...selectedSlots, ...selectedColumnSlots]);
    }
  };

  // Handle row selection (time click)
  const handleRowSelection = (hour) => {
    const selectedRowSlots = weekDays.flatMap((day) =>
      generateTimeRanges(hour).map(
        (timeRange) => `${day.toISOString().split("T")[0]} ${timeRange}`
      )
    );

    if (selectedSlots.some((slot) => selectedRowSlots.includes(slot))) {
      // Deselect the row if any slot in the row is already selected
      setSelectedSlots(
        selectedSlots.filter((slot) => !selectedRowSlots.includes(slot))
      );
    } else {
      // Select the entire row
      setSelectedSlots([...selectedSlots, ...selectedRowSlots]);
    }
  };

  return (
    <>
      <header id="grp-header" className="grp-navbar">
        <div className="grp-container">
          <div className="grp-navbar-left">
            <button onClick={() => navigate("/")} className="grp-logo-btn">
              <img src={KeepTrek} alt="KeepTrek Logo" className="grp-logo" />
            </button>
            <button
              onClick={() => navigate("/schedule")}
              className="grp-nav-link"
            >
              Group Scheduling
            </button>
          </div>
          <div className="grp-navbar-right">
            <button onClick={() => navigate("#")} className="grp-nav-link">
              How it Works
            </button>
            <button onClick={() => navigate("#")} className="grp-nav-link">
              History
            </button>
            <button className="grp-profile-btn">
              <PersonIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="grp-content">
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
              className={`view-toggle ${viewMode === "weekly" ? "active" : ""}`}
              onClick={() => setViewMode("weekly")}
            >
              Week
            </button>
            <button
              className={`view-toggle ${
                viewMode === "monthly" ? "active" : ""
              }`}
              onClick={() => setViewMode("monthly")}
            >
              Month
            </button>
          </div>
        </div>

        {viewMode === "weekly" ? (
          <div
            className="scrollable-calendar"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={calendarContainerRef}
          >
            <div className="calendar-grid" onMouseDown={preventTextSelection}>
              <div className="calendar-header">
                <div className="time-slot-header"></div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="day-header"
                    onClick={() => handleColumnSelection(day)}
                  >
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
                    <div
                      className="time-slot"
                      onClick={() => handleRowSelection(hour)}
                    >
                      {hour}:00
                    </div>
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="hour-slot">
                        {generateTimeRanges(hour).map((timeRange) => {
                          const isSelected = selectedSlots.includes(
                            `${day.toISOString().split("T")[0]} ${timeRange}`
                          );
                          return (
                            <div
                              key={timeRange}
                              className={`slot ${isSelected ? "selected" : ""}`}
                              onMouseDown={() =>
                                handleMouseDown(day, timeRange)
                              }
                              onMouseOver={() =>
                                handleMouseOver(day, timeRange)
                              }
                              onDragStart={(e) => e.preventDefault()}
                              data-tooltip={timeRange}
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
          <div
            className="monthly-view"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="calendar-month-grid">
              {monthDays.map((day, index) => {
                const date = day.toISOString().split("T")[0];
                const isSelected = selectedDates.includes(date);
                return (
                  <div
                    key={index}
                    className={`month-day ${isSelected ? "selected" : ""}`}
                    onMouseDown={() => handleDateMouseDown(day)}
                    onMouseOver={() => handleDateMouseOver(day)}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="btn-group">
          <button className="btn-primary" onClick={handleClearAll}>
            Clear All
          </button>
          <button className="btn-primary" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>
    </>
  );
};
