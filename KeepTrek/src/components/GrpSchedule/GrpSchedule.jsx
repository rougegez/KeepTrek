import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  fetchAvailableTrips,
  updateAvailability,
  getUserAvailability,
} from "@/APIs/dateFinder";
import AvailableTrips from "@/components/GrpSchedule/AvailableTrips";
import MobileHeader from "../MobileHeader";
import { useMediaQuery } from "react-responsive";
import { canEdit } from "@/utils/permissions";
import { useQuery } from "react-query";
import { getTrip } from "@/APIs/trip";
import { CurrentUser } from "@/APIs/auth";
import { toast } from "sonner";

export const GrpSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [availableTrips, setAvailableTrips] = useState([]);
  const isDragging = useRef(false);
  const { tripID } = useParams();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [currentUser, setCurrentUser] = useState(null);
  const { data: tripDetails } = useQuery(['trip', tripID], () => getTrip(tripID));

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await CurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  // Only compute userRole when both currentUser and tripDetails are available
  const userRole = useMemo(() => {
    if (!currentUser || !tripDetails?.users) return null;
    const userInTrip = tripDetails.users.find(u => u.userID === currentUser);
    console.log('User lookup:', { currentUser, userInTrip });
    return userInTrip?.role;
  }, [currentUser, tripDetails]);

  const canModify = useMemo(() => {
    return canEdit(userRole);
  }, [userRole]);

  // Load existing availability for the current user
  const loadUserAvailability = async () => {
    try {
      const userAvailability = await getUserAvailability(tripID);
      setSelectedDates(new Set(userAvailability));
    } catch (error) {
      console.error("Error loading user availability:", error.message);
    }
  };

  // Fetch trips from the backend
  const loadAvailableTrips = async () => {
    try {
      const trips = await fetchAvailableTrips();
      const currentTrip = trips.find((trip) => trip.tripID === tripID);

      if (!currentTrip) throw new Error("Trip not found");
      setAvailableTrips(currentTrip.available_dates || []);
    } catch (error) {
      console.error("Error fetching trips:", error.message);
      toast.error("Failed to fetch available trips");
    }
  };

  // Submit selected dates to the backend
  const handleSubmit = async () => {
    try {
      const result = await updateAvailability(
        Array.from(selectedDates),
        tripID
      );
      console.log("Availability saved:", result);
      toast.success("Availability successfully submitted!");
      window.location.reload(); // Refresh the page after successful submission
    } catch (error) {
      console.error("Error saving availability:", error.message);
      toast.error("Failed to submit availability");
    }
  };

  useEffect(() => {
    loadUserAvailability();
    loadAvailableTrips();
  }, []);

  // Generate calendar days for the current month
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();

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

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(date).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (date === null) return;

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

  const handleDragStart = (date) => (e) => {
    e.preventDefault();
    if (date === null) return;
    isDragging.current = true;
    handleDateSelect(date);
  };

  const handleDragEnter = (date) => () => {
    if (isDragging.current && date !== null) {
      handleDateSelect(date);
    }
  };

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
      <AppSidebar tripID={tripID}/>
      {isMobile && <MobileHeader title="Group Schedule" />}
      <div className="flex h-screen w-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 bg-gray-100 shadow">
            <h1 className="text-xl font-bold">Group Schedule</h1>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-md mx-auto p-4">
              <div className="mb-8">
                {/* Only show the calendar if user role is loaded and has permissions */}
                {userRole && canModify ? (
                  <div>
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
                              className={`p-2 rounded-md text-sm ${
                                date
                                  ? "hover:bg-primary/10 cursor-pointer"
                                  : "text-muted-foreground cursor-not-allowed"
                              } ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }`}
                            >
                              {date || ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
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
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ) : userRole && !canModify ? (
                  <p className="text-muted-foreground">
                    You don't have permission to modify the schedule.
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Loading calendar...
                  </p>
                )}

                {/* Always show available trips section */}
                <div className="space-y-4 mt-8">
                  <h3 className="text-xl font-bold">Available trip dates</h3>
                  <AvailableTrips tripID={tripID} />
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
