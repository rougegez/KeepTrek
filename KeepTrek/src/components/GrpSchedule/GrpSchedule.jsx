import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";

export const GrpSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const isDragging = useRef(false);

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
    return new Date(year, month + 1, 0).getDate(); // month is 0-indexed
  };

  // Generate calendar days for the current month
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    const calendar = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to handle date selection/deselection
  const handleDateSelect = (date) => {
    if (date === null) return; // Do nothing for empty slots

    const formattedDate = formatDate(date);
    setSelectedDates((prev) => {
      const newSelectedDates = new Set(prev);
      if (newSelectedDates.has(formattedDate)) {
        newSelectedDates.delete(formattedDate);
      } else {
        newSelectedDates.add(formattedDate);
      }
      return newSelectedDates;
    });
  };

  // Handle the start of dragging
  const handleDragStart = (date) => (e) => {
    e.preventDefault(); // Prevent text selection
    if (date === null) return; // Do not initiate drag on empty slots
    isDragging.current = true;
    handleDateSelect(date); // Select the first date when dragging starts
  };

  // Handle mouse dragging over a date (selecting dates)
  const handleDragEnter = (date) => () => {
    if (isDragging.current && date !== null) {
      handleDateSelect(date);
    }
  };

  // Handle the end of dragging
  const handleDragEnd = () => {
    isDragging.current = false;
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

  // Handle global mouse up to end dragging when mouse is released outside the date buttons
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging.current) {
        handleDragEnd();
      }
    };
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 bg-gray-100 shadow">
            <h1 className="text-xl font-bold">Group Schedule</h1>
          </header>

          <main className="flex-1 overflow-hidden">
            {" "}
            {/* Changed overflow-auto to overflow-hidden */}
            <div className="max-w-md mx-auto p-4 h-full">
              {" "}
              {/* Added h-full to ensure it fits within the container */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  Select your available dates!
                </h2>

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
                    {generateCalendar().map((date, index) => {
                      const formattedDate = date ? formatDate(date) : "";
                      const isSelected = selectedDates.has(formattedDate);

                      return (
                        <button
                          key={index}
                          onMouseDown={handleDragStart(date)}
                          onMouseEnter={handleDragEnter(date)}
                          onMouseUp={handleDragEnd}
                          disabled={date === null}
                          className={`
                            p-2 rounded-md text-sm
                            ${
                              date
                                ? "hover:bg-primary/10 cursor-pointer"
                                : "text-muted-foreground cursor-not-allowed"
                            }
                            ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                          `}
                        >
                          {date || ""}
                        </button>
                      );
                    })}
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
                          <div className="text-sm font-medium">
                            {trip.price}
                          </div>
                        </div>
                        <Button>Select</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GrpSchedule;
