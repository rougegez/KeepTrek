import React, { useState, useRef } from "react";
import KeepTrek from "../../assets/KeepTrek.png";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import DaySchedule from "./DaySchedule";
import MonthlySchedule from "./MonthlySchedule";

export const GrpSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedDates, setSelectedDates] = useState([]);
  const [temporarySelection, setTemporarySelection] = useState(new Set());
  const isDragging = useRef(false);
  const dragStartIndex = useRef(null);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "monthly" ? "weekly" : "monthly"));
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev);
      if (viewMode === "weekly") {
        nextDate.setDate(prev.getDate() + 7);
      } else {
        nextDate.setMonth(prev.getMonth() + 1);
      }
      return nextDate;
    });
  };

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const prevDate = new Date(prev);
      if (viewMode === "weekly") {
        prevDate.setDate(prev.getDate() - 7);
      } else {
        prevDate.setMonth(prev.getMonth() - 1);
      }
      return prevDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDragStart = (index) => {
    isDragging.current = true;
    dragStartIndex.current = index;
    setTemporarySelection(new Set([index]));
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    setTemporarySelection(new Set());
    dragStartIndex.current = null;
  };

  const handleDragEnter = (index) => {
    if (isDragging.current) {
      setTemporarySelection((prev) => new Set(prev.add(index)));
    }
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const formattedMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 bg-gray-100 shadow">
            <h1 className="text-xl font-bold">Group Schedule</h1>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                {viewMode === "monthly"
                  ? `Monthly Calendar - ${formattedMonth}`
                  : `Weekly Schedule - ${formattedMonth}`}
              </h2>

              {viewMode === "weekly" ? (
                <div className="grid grid-cols-7 gap-4">
                  {getWeekDates().map((date, index) => (
                    <DaySchedule key={index} date={date} />
                  ))}
                </div>
              ) : (
                <MonthlySchedule
                  currentDate={currentDate}
                  selectedDates={selectedDates}
                  temporarySelection={temporarySelection}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  handleDragEnter={handleDragEnter}
                />
              )}

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 border rounded text-white hover:opacity-80"
                    style={{ backgroundColor: "#4DB6AC" }}
                    onClick={handleToday}
                  >
                    Today
                  </button>
                  <button
                    className="px-4 py-2 border rounded text-white hover:opacity-80"
                    style={{ backgroundColor: "#4DB6AC" }}
                    onClick={() => console.log("Submit action")}
                  >
                    Submit
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 border rounded text-white hover:opacity-80"
                    style={{ backgroundColor: "#818c91" }}
                    onClick={handlePrevious}
                  >
                    {viewMode === "monthly"
                      ? "Previous Month"
                      : "Previous Week"}
                  </button>
                  <button
                    className="px-4 py-2 border rounded text-white hover:opacity-80"
                    style={{ backgroundColor: "#818c91" }}
                    onClick={handleNext}
                  >
                    {viewMode === "monthly" ? "Next Month" : "Next Week"}
                  </button>
                </div>
                <button
                  className="px-4 py-2 border rounded text-white hover:opacity-80"
                  style={{ backgroundColor: "#4DB6AC" }}
                  onClick={toggleViewMode}
                >
                  {viewMode === "monthly"
                    ? "Switch to Weekly View"
                    : "Switch to Monthly View"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GrpSchedule;
