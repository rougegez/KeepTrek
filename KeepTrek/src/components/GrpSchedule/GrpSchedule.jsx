import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useQuery } from "react-query";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  fetchAvailableTrips,
  updateAvailability,
  getUserAvailability,
} from "@/APIs/dateFinder";
import AvailableTrips from "@/components/GrpSchedule/AvailableTrips";
import MobileHeader from "../MobileHeader";
import { canEdit } from "@/utils/permissions";
import { getTrip } from "@/APIs/trip";
import { CurrentUser } from "@/APIs/auth";
import Calendar from "@/components/GrpSchedule/Calendar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const GrpSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [loading, setLoading] = useState(false); // New: Track submit loading state
  const { tripID } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentUser, setCurrentUser] = useState(null);
  
  const { data: tripDetails } = useQuery(["trip", tripID], () => getTrip(tripID));

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await CurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const userRole = useMemo(() => {
    if (!currentUser || !tripDetails?.users) return null;
    const userInTrip = tripDetails.users.find((u) => u.userID === currentUser);
    return userInTrip?.role;
  }, [currentUser, tripDetails]);

  const canModify = useMemo(() => canEdit(userRole), [userRole]);

  // Load user's availability
  useEffect(() => {
    const loadUserAvailability = async () => {
      try {
        const userAvailability = await getUserAvailability(tripID);
        setSelectedDates(new Set(userAvailability));
      } catch (error) {
        console.error("Error loading user availability:", error.message);
      }
    };
    loadUserAvailability();
  }, [tripID]);

  // Submit selected dates
  const handleSubmit = async () => {
    try {
      setLoading(true); // Show loading spinner
      const result = await updateAvailability(Array.from(selectedDates), tripID);
      console.log("Availability saved:", result);
      alert("Availability successfully submitted!");
      window.location.reload();
    } catch (error) {
      console.error("Error saving availability:", error.message);
      alert("Failed to submit availability");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID} />
      {isMobile && <MobileHeader title="Group Schedule" />}
      <div className="flex h-screen w-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 bg-gray-100 shadow">
            <h1 className="text-xl font-bold">Group Schedule</h1>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="w-full p-4">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Select your available dates!
              </h2>
              {userRole ? (
                canModify ? (
                  <div className="flex justify-center overflow-x-auto">
                    <div className="w-full md:w-auto md:min-w-[750px] mx-auto">
                      <Calendar
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        handleSubmit={handleSubmit}
                        loading={loading} // Pass loading state
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    You don't have permission to modify the schedule.
                  </p>
                )
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div style={{ transform: "scale(1.8)" }}>
                    <LoadingSpinner />
                  </div>
                </div>
              )}
            </div>
            {/* Period Cards Now Always Visible */}
            <div className="max-w-md mx-auto p-4">
              <AvailableTrips tripID={tripID} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GrpSchedule;
