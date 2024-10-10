import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PersonIcon } from "@primer/octicons-react";
import KeepTrek from "../../assets/KeepTrek.png";
import "./GrpSchedule.css";

export const GrpSchedule = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Get the current week days (from Sunday to Saturday)
  const getCurrentWeekDays = () => {
    const currentWeek = [];
    const startOfWeek = today.getDate() - today.getDay(); // Get the start of the week (Sunday)
    for (let i = 0; i < 7; i++) {
      const day = new Date(today.setDate(startOfWeek + i));
      currentWeek.push(day);
    }
    return currentWeek;
  };

  const weekDays = getCurrentWeekDays();

  // Handle time slot selection
  const handleSlotClick = (day, time, minutes) => {
    const slot = `${day.toISOString().split("T")[0]} ${time}:${minutes}`;
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot)); // Deselect slot
    } else {
      setSelectedSlots([...selectedSlots, slot]); // Select slot
    }
  };

  // Proceed action
  const handleProceed = () => {
    alert(`Selected slots: ${selectedSlots.join(", ")}`);
  };

  // Generate hourly intervals with 4 boxes (15-minute intervals) per hour
  const generateHourlyIntervals = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour.toString().padStart(2, "0"); // Formatting hour with 2 digits
      hours.push(time);
    }
    return hours;
  };

  const hourlyIntervals = generateHourlyIntervals();

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

        {/* Calendar Grid */}
        <div className="calendar-grid">
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

          {/* Time intervals from 00:00 to 23:00, each divided into 4 slots per hour */}
          <div className="calendar-body">
            {hourlyIntervals.map((time, timeIndex) => (
              <div key={timeIndex} className="time-row">
                <div className="time-slot">{time}:00</div>
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="hour-slot">
                    {/* Four 15-minute slots per hour */}
                    {["00", "15", "30", "45"].map((minutes) => {
                      const slot = `${
                        day.toISOString().split("T")[0]
                      } ${time}:${minutes}`;
                      const isSelected = selectedSlots.includes(slot);
                      return (
                        <div
                          key={minutes}
                          className={`slot ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSlotClick(day, time, minutes)}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </>
  );
};
