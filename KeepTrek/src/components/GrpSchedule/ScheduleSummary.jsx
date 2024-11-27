// src/components/GrpSchedule/ScheduleSummary.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScheduleSummary.css";
import KeepTrek from "../../assets/KeepTrek.png";

export const ScheduleSummary = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    // Mock authentication check for demonstration purposes
    const currentUser = { uid: "12345" }; // Replace with actual user authentication if needed
    if (currentUser) {
      setUser(currentUser);
      setShowLoginModal(false);
      setShowRegisterModal(false);
      // Fetch schedule data (mock data for demo purposes)
      fetchScheduleData(currentUser.uid);
    } else {
      setUser(null);
      setShowLoginModal(true); // Show login modal if not authenticated
    }
  }, []);

  const fetchScheduleData = (userId) => {
    // Mock schedule data for demonstration purposes
    const weeklyData = {
      freeSlots: [
        "2024-11-28 09:00-09:15",
        "2024-11-28 10:00-10:15",
        "2024-11-29 11:00-11:15",
      ],
      busySlots: [
        "2024-11-28 13:00-13:15",
        "2024-11-29 14:00-14:15",
      ],
    };
    const monthlyData = {
      freeDates: ["2024-11-01", "2024-11-02"],
      busyDates: ["2024-11-03", "2024-11-04"],
    };
    setWeeklyData(weeklyData);
    setMonthlyData(monthlyData);
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setUser({ uid: "12345" }); // Mock user data for demonstration
    fetchScheduleData("12345");
  };

  // Function to handle closing the modal and redirecting to home
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    navigate("/");
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
            <button
              onClick={() => navigate("/schedule-summary")}
              className="grp-nav-link"
            >
              History
            </button>
            {user ? (
              <button
                className="grp-profile-btn"
                onClick={() => setUser(null)} // Mock logout functionality
              >
                Logout
              </button>
            ) : (
              <button
                className="grp-profile-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="schedule-summary">
        <div className="grp-content">
          <h1>Your Schedule Summary</h1>

          {weeklyData && (
            <div className="schedule-section">
              <h2>Weekly Schedule</h2>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Free Slots</th>
                    <th>Busy Slots</th>
                  </tr>
                </thead>
                <tbody>{generateWeeklyRows(weeklyData)}</tbody>
              </table>
            </div>
          )}

          {monthlyData && (
            <div className="schedule-section">
              <h2>Monthly Schedule</h2>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{generateMonthlyRows(monthlyData)}</tbody>
              </table>
            </div>
          )}

          {!weeklyData && !monthlyData && (
            <p>You have not saved any schedule data yet.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Login</h2>
            <button onClick={handleAuthSuccess}>Mock Login</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Register</h2>
            <button onClick={handleAuthSuccess}>Mock Register</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

// Helper functions to generate table rows
const generateWeeklyRows = (weeklyData) => {
  if (!weeklyData) return null;

  const freeSlotsByDay = groupSlotsByDay(weeklyData.freeSlots || []);
  const busySlotsByDay = groupSlotsByDay(weeklyData.busySlots || []);

  const allDays = Array.from(
    new Set([...Object.keys(freeSlotsByDay), ...Object.keys(busySlotsByDay)])
  ).sort();

  return allDays.map((day) => (
    <tr key={day}>
      <td>{formatDateForDisplay(day)}</td>
      <td>{(freeSlotsByDay[day] || []).join(", ") || "None"}</td>
      <td>{(busySlotsByDay[day] || []).join(", ") || "None"}</td>
    </tr>
  ));
};

const groupSlotsByDay = (slots) => {
  const grouped = {};
  slots.forEach((slot) => {
    const [day, timeRange] = slot.split(" ");
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(timeRange);
  });
  return grouped;
};

const generateMonthlyRows = (monthlyData) => {
  if (!monthlyData) return null;

  const { freeDates = [], busyDates = [] } = monthlyData;

  const allDates = Array.from(new Set([...freeDates, ...busyDates])).sort();

  return allDates.map((date) => (
    <tr key={date}>
      <td>{formatDateForDisplay(date)}</td>
      <td>{busyDates.includes(date) ? "Busy" : "Free"}</td>
    </tr>
  ));
};

// Helper function to format date strings for display
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
