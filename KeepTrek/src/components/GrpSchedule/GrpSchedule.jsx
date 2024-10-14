// src/components/GrpSchedule/GrpSchedule.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersonIcon } from "@primer/octicons-react";
import KeepTrek from "../../assets/KeepTrek.png";
import "./GrpSchedule.css";
import { firestore, auth } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import getDoc for fetching existing data
import { Login } from "../Authentication/Login";
import { Register } from "../Authentication/Register";

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

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Helper function to format date as 'YYYY-MM-DD' using local time
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check for authentication when component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowLoginModal(false);
        setShowRegisterModal(false);
        await fetchUserSchedule(currentUser.uid); // Fetch existing schedule data
      } else {
        setUser(null);
        setShowLoginModal(true); // Show login modal if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

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

  // Helper function to get dates between two dates
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    const increment = current <= end ? 1 : -1;

    while (true) {
      dates.push(new Date(current));
      if (current.getTime() === end.getTime()) {
        break;
      }
      current.setDate(current.getDate() + increment);
    }
    return dates;
  };

  // Handle slot click or drag for weekly view
  const handleSlotClickOrDrag = (day, timeRange, isDraggingAction = false) => {
    const slot = `${formatDate(day)} ${timeRange}`;

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

  // Mouse events for weekly view
  const handleMouseDown = (day, timeRange) => {
    const slot = `${formatDate(day)} ${timeRange}`;
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

  // Function to save schedule data under the authenticated user's Firestore document
  const handleProceed = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const userId = user.uid;

      if (viewMode === "weekly") {
        // Generate all possible slots
        const allSlots = [];
        weekDays.forEach((day) => {
          hourlyIntervals.forEach((hour) => {
            const timeRanges = generateTimeRanges(hour);
            timeRanges.forEach((timeRange) => {
              const slot = `${formatDate(day)} ${timeRange}`;
              allSlots.push(slot);
            });
          });
        });

        // Compute unselectedSlots
        const unselectedSlots = allSlots.filter(
          (slot) => !selectedSlots.includes(slot)
        );

        // Prepare data to save
        const data = {
          busySlots: selectedSlots,
          freeSlots: unselectedSlots,
          timestamp: new Date(),
        };

        // Save data to Firestore under the user's document
        await setDoc(
          doc(firestore, "users", userId, "schedules", "weekly"),
          data,
          { merge: true } // Use merge to update existing data
        );
      } else if (viewMode === "monthly") {
        // Generate all possible dates
        const allDates = monthDays.map((day) => formatDate(day));

        // Compute unselectedDates
        const unselectedDates = allDates.filter(
          (date) => !selectedDates.includes(date)
        );

        // Prepare data to save
        const data = {
          busyDates: selectedDates,
          freeDates: unselectedDates,
          timestamp: new Date(),
        };

        // Save data to Firestore under the user's document
        await setDoc(
          doc(firestore, "users", userId, "schedules", "monthly"),
          data,
          { merge: true } // Use merge to update existing data
        );
      }

      alert("Schedule saved successfully!");
    } catch (error) {
      console.error("Error saving to Firestore: ", error);
      alert("Failed to save schedule. Please try again.");
    }
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
        (timeRange) => `${formatDate(day)} ${timeRange}`
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
        (timeRange) => `${formatDate(day)} ${timeRange}`
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

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setUser(auth.currentUser);
  };

  // Function to handle closing the modal and redirecting to home
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    navigate("/");
  };

  return (
    <>
      {/* Header/Navbar */}
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
            {/* Updated History button to navigate to /schedule-summary */}
            <button
              onClick={() => navigate("/schedule-summary")}
              className="grp-nav-link"
            >
              History
            </button>
            {user ? (
              <button
                className="grp-profile-btn"
                onClick={() => auth.signOut()}
              >
                <PersonIcon size={24} />
                Logout
              </button>
            ) : (
              <button
                className="grp-profile-btn"
                onClick={() => setShowLoginModal(true)}
              >
                <PersonIcon size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

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
                            `${formatDate(day)} ${timeRange}`
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
                const date = formatDate(day);
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

        {/* Action Buttons */}
        <div className="btn-group">
          <button className="btn-primary" onClick={handleClearAll}>
            Clear All
          </button>
          <button className="btn-primary" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <Login
          closeModal={handleCloseModal} // Redirects to home on close
          switchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showRegisterModal && (
        <Register
          closeModal={handleCloseModal} // Redirects to home on close
          switchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};
