// src/components/GrpSchedule/ScheduleSummary.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Login } from "../Authentication/Login";
import { Register } from "../Authentication/Register";
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
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowLoginModal(false);
        setShowRegisterModal(false);
        // Fetch schedule data
        await fetchScheduleData(currentUser.uid);
      } else {
        setUser(null);
        setShowLoginModal(true); // Show login modal if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchScheduleData = async (userId) => {
    try {
      // Fetch weekly data
      const weeklyDocRef = collection(firestore, "schedules", userId, "weekly");
      const weeklySnapshot = await getDocs(weeklyDocRef);
      if (!weeklySnapshot.empty) {
        const weeklyData = weeklySnapshot.docs
          .filter((doc) => doc.id === "current") // Ensure we're getting the 'current' document
          .map((doc) => doc.data())[0];
        setWeeklyData(weeklyData);
      }

      // Fetch monthly data
      const monthlyDocRef = collection(
        firestore,
        "schedules",
        userId,
        "monthly"
      );
      const monthlySnapshot = await getDocs(monthlyDocRef);
      if (!monthlySnapshot.empty) {
        const monthlyData = monthlySnapshot.docs
          .filter((doc) => doc.id === "current") // Ensure we're getting the 'current' document
          .map((doc) => doc.data())[0];
        setMonthlyData(monthlyData);
      }
    } catch (error) {
      console.error("Error fetching schedule data: ", error);
    }
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setUser(auth.currentUser);
    fetchScheduleData(auth.currentUser.uid);
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
            {/* Removed My Schedule button */}
            {/* <button
              onClick={() => navigate("/summary")}
              className="grp-nav-link"
            >
              My Schedule
            </button> */}
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
