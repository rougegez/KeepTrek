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

  // Scroll the calendar to show 12:00 initially
  useEffect(() => {
    if (calendarContainerRef.current) {
      const hourHeight = 50;
      const noonScrollPosition = hourHeight * 18;
      calendarContainerRef.current.scrollTop = noonScrollPosition;
    }
  }, []);

  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return startOfWeek;
  };

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

  const weekDays = getCurrentWeekDays();
  const currentMonth = weekDays[0].toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleSlotClickOrDrag = (day, timeRange, isDraggingAction = false) => {
    const slot = `${day.toISOString().split("T")[0]} ${timeRange}`;

    if (!isDraggingAction) {
      if (selectedSlots.includes(slot)) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slot));
      } else {
        setSelectedSlots([...selectedSlots, slot]);
      }
    } else if (isDraggingAction) {
      if (dragMode.current === "select") {
        if (!selectedSlots.includes(slot)) {
          setSelectedSlots((prev) => [...prev, slot]);
        }
      } else if (dragMode.current === "deselect") {
        setSelectedSlots((prev) => prev.filter((s) => s !== slot));
      }
    }
  };

  const handleMouseDown = (day, timeRange) => {
    const slot = `${day.toISOString().split("T")[0]} ${timeRange}`;
    dragMode.current = selectedSlots.includes(slot) ? "deselect" : "select";
    handleSlotClickOrDrag(day, timeRange);
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragMode.current = null;
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
    alert(`Selected slots: ${selectedSlots.join(", ")}`);
  };

  const handleClearAll = () => {
    setSelectedSlots([]);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
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

        <div className="calendar-navigation">
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
          <div className="calendar-month">{currentMonth}</div>
        </div>

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

        <div className="btn-group">
          <button className="btn-secondary" onClick={handleClearAll}>
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
