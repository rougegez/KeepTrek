import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersonIcon } from "@primer/octicons-react";
import KeepTrek from "../../assets/KeepTrek.png";
import "./GrpSchedule.css";

export const GrpSchedule = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date in view
  const [selectedSlots, setSelectedSlots] = useState([]);
  const isDragging = useRef(false); // Track if the user is dragging
  const dragMode = useRef(null); // Track whether we are selecting or deselecting
  const calendarContainerRef = useRef(null); // Reference for the scrollable calendar container

  // Scroll the calendar to show 16:00 initially
  useEffect(() => {
    if (calendarContainerRef.current) {
      // Assuming each hour slot has a fixed height, calculate the scroll position for 12:00
      const hourHeight = 50; // Adjust according to your slot height (use actual height in px)
      const noonScrollPosition = hourHeight * 18; // Scroll to 16th hour (16:00)
      calendarContainerRef.current.scrollTop = noonScrollPosition;
    }
  }, []);

  // Helper to get start of the week (Monday) for any given date
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust for Monday as the first day
    return startOfWeek;
  };

  // Get the current week days starting from Monday to Sunday
  const getCurrentWeekDays = () => {
    const currentWeek = [];
    const startOfWeek = getStartOfWeek(currentDate); // Get Monday of the current week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      currentWeek.push(day);
    }
    return currentWeek;
  };

  const weekDays = getCurrentWeekDays();

  // Get the current month based on the first day of the week
  const currentMonth = weekDays[0].toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Handle time slot selection (click or drag)
  const handleSlotClickOrDrag = (day, timeRange, isDraggingAction = false) => {
    const slot = `${day.toISOString().split("T")[0]} ${timeRange}`;

    if (!isDragging.current && !isDraggingAction) {
      // For normal clicking
      if (selectedSlots.includes(slot)) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slot)); // Deselect slot
      } else {
        setSelectedSlots([...selectedSlots, slot]); // Select slot
      }
    } else if (isDraggingAction) {
      // For drag behavior
      if (dragMode.current === "select") {
        if (!selectedSlots.includes(slot)) {
          setSelectedSlots((prev) => [...prev, slot]); // Select slot
        }
      } else if (dragMode.current === "deselect") {
        setSelectedSlots((prev) => prev.filter((s) => s !== slot)); // Deselect slot
      }
    }
  };

  // Handle the start of dragging (mousedown event)
  const handleMouseDown = (day, timeRange) => {
    isDragging.current = true; // Start dragging
    const slot = `${day.toISOString().split("T")[0]} ${timeRange}`;
    dragMode.current = selectedSlots.includes(slot) ? "deselect" : "select"; // Determine if we are selecting or deselecting
    handleSlotClickOrDrag(day, timeRange); // Start by selecting/deselecting the first slot
  };

  // Handle mouse up (end of dragging)
  const handleMouseUp = () => {
    isDragging.current = false; // End dragging
    dragMode.current = null; // Reset drag mode
  };

  // Handle mouse over (during dragging)
  const handleMouseOver = (day, timeRange) => {
    if (isDragging.current) {
      handleSlotClickOrDrag(day, timeRange, true); // Handle slot during drag
    }
  };

  // Prevent text selection during dragging
  const preventTextSelection = (event) => {
    event.preventDefault();
  };

  // Proceed action
  const handleProceed = () => {
    alert(`Selected slots: ${selectedSlots.join(", ")}`);
  };

  // Navigate to the previous week
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to the next week
  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Navigate to the current week (Today)
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate hourly intervals
  const generateHourlyIntervals = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, "0"); // Formatting hour with 2 digits
      hours.push(time);
    }
    return hours;
  };

  const hourlyIntervals = generateHourlyIntervals();

  // Generate the time range labels (00:00-00:15, 00:15-00:30, 00:30-00:45, 00:45-01:00) for each hour
  const generateTimeRanges = (hour) => {
    const ranges = [
      `${hour}:00-${hour}:15`,
      `${hour}:15-${hour}:30`,
      `${hour}:30-${hour}:45`,
      `${hour}:45-${(parseInt(hour) + 1).toString().padStart(2, "0")}:00`,
    ];
    return ranges;
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
        <h1>Group Scheduling</h1>

        {/* Calendar Navigation and Month Display */}
        <div className="calendar-navigation">
          {/* Navigation buttons aligned to the left */}
          <div className="calendar-nav-left">
            <button
              onClick={handlePreviousWeek}
              className="calendar-nav-button"
            >
              &lt; Previous
            </button>
            <button onClick={handleToday} className="calendar-nav-button">
              Today
            </button>
            <button onClick={handleNextWeek} className="calendar-nav-button">
              Next &gt;
            </button>
          </div>

          {/* Current month displayed on the right */}
          <div className="calendar-month">{currentMonth}</div>
        </div>

        {/* Scrollable Calendar Segment */}
        <div
          className="scrollable-calendar"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          ref={
            calendarContainerRef
          } /* Ref for the scrollable calendar container */
        >
          {/* Calendar Grid */}
          <div className="calendar-grid" onMouseDown={preventTextSelection}>
            {/* Header: Days of the week */}
            <div className="calendar-header">
              <div className="time-slot-header"></div>{" "}
              {/* Empty for time column */}
              {weekDays.map((day, index) => (
                <div key={index} className="day-header">
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </div>
              ))}
            </div>

            {/* Time intervals from 00:00 to 23:00, each divided into 4 time ranges per hour */}
            <div className="calendar-body">
              {hourlyIntervals.map((hour, timeIndex) => (
                <div key={timeIndex} className="time-row">
                  <div className="time-slot">{hour}:00</div>
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="hour-slot">
                      {/* Four time ranges per hour */}
                      {generateTimeRanges(hour).map((timeRange) => {
                        const isSelected = selectedSlots.includes(
                          `${day.toISOString().split("T")[0]} ${timeRange}`
                        );
                        return (
                          <div
                            key={timeRange}
                            className={`slot ${isSelected ? "selected" : ""}`}
                            onMouseDown={() => handleMouseDown(day, timeRange)}
                            onMouseOver={() => handleMouseOver(day, timeRange)}
                            onDragStart={(e) => e.preventDefault()}
                            data-tooltip={timeRange}
                          >
                            {/* No time display for active slots */}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </>
  );
};
