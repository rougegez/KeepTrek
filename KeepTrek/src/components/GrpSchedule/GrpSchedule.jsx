import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";

export const GrpSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false); // To track if dragging occurred
  const dragStartDate = useRef(null); // To store the start date of the drag

  // Sample available trips data
  const availableTrips = [
    {
      startDate: "2025-03-01",
      endDate: "2025-03-05",
      nights: 4,
      price: "RM 1,000",
    },
    {
      startDate: "2025-03-10",
      endDate: "2025-03-15",
      nights: 5,
      price: "RM 1,500",
    },
    {
      startDate: "2025-04-01",
      endDate: "2025-04-07",
      nights: 6,
      price: "RM 2,000",
    },
  ];

  // Function to get the number of days in a given month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  // Generate calendar days for the current month
  const generateCalendar = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const daysInMonth = getDaysInMonth(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    );
    const startDay = firstDayOfMonth.getDay(); // Day of the week the month starts on
    const calendar = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Add empty slots for days before the first of the month
    const calendarWithPadding = Array(startDay).fill(null).concat(calendar);
    return calendarWithPadding;
  };

  // Handle the start of dragging
  const handleDragStart = (date) => (e) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    setHasDragged(false);
    dragStartDate.current = date; // Set the start date of dragging
    // Optionally select the first date when dragging starts
    handleDateClick(date, false); // Pass false to indicate it's part of drag
  };

  // Handle the end of dragging
  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartDate.current = null;
    setHasDragged(false);
  };

  // Handle mouse dragging over a date (select or deselect dates)
  const handleDragEnter = (date) => () => {
    if (isDragging && date) {
      setHasDragged(true);
      handleDateClick(date, true); // Pass true to indicate it's part of drag
    }
  };

  // Function to handle date selection/deselection
  const handleDateClick = (date, fromDrag = false) => {
    if (date) {
      const yearMonth = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }`;
      const currentMonthSelectedDates = selectedDates[yearMonth] || [];
      if (currentMonthSelectedDates.includes(date)) {
        // Remove date if already selected
        setSelectedDates({
          ...selectedDates,
          [yearMonth]: currentMonthSelectedDates.filter((d) => d !== date),
        });
      } else {
        // Add date to selected dates
        setSelectedDates({
          ...selectedDates,
          [yearMonth]: [...currentMonthSelectedDates, date],
        });
      }
    }
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev);
      nextDate.setMonth(prev.getMonth() + 1);
      return nextDate;
    });
  };

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const prevDate = new Date(prev);
      prevDate.setMonth(prev.getMonth() - 1);
      return prevDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    // This will update the month and calendar when currentDate changes
    generateCalendar();
  }, [currentDate]);

  // Optional: Handle global mouse up to end dragging when mouse is released outside the date buttons
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [isDragging]);

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
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePrevious} className="p-2">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-medium">
                    {currentDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button onClick={handleNext} className="p-2">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-sm text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {generateCalendar().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!hasDragged) {
                          // Only handle click if not dragging
                          handleDateClick(date);
                        }
                      }}
                      onMouseDown={handleDragStart(date)}
                      onMouseEnter={handleDragEnter(date)}
                      onMouseUp={handleDragEnd}
                      disabled={!date} // Disable empty slots
                      className={`
                        p-2 rounded-md text-sm
                        ${
                          date
                            ? "hover:bg-primary/10 cursor-pointer"
                            : "text-muted-foreground"
                        }
                        ${
                          selectedDates[
                            `${currentDate.getFullYear()}-${
                              currentDate.getMonth() + 1
                            }`
                          ]?.includes(date)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      `}
                    >
                      {date || ""}
                    </button>
                  ))}
                </div>
              </div>

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
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-bold">Available trip dates</h3>
                {availableTrips.map((trip, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {trip.startDate} - {trip.endDate}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trip.nights} Days {trip.nights + 1} Nights
                        </div>
                        <div className="text-sm font-medium">{trip.price}</div>
                      </div>
                      <Button>Select</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GrpSchedule;
