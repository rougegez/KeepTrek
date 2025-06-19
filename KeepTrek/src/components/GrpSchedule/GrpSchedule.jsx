import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useQuery, useMutation, useQueryClient } from "react-query";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  fetchAvailableTrips,
  updateAvailability,
  getUserAvailability,
} from "@/APIs/dateFinder";
import AvailableTrips from "@/components/GrpSchedule/AvailableTrips";
import MobileHeader from "../MobileHeader";
import { canEdit } from "@/utils/permissions";
import { getTrip } from "@/APIs/trip";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthProvider.jsx";
import Calendar from "@/components/GrpSchedule/Calendar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const GrpSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [durationFilter, setDurationFilter] = useState(5);
  const { tripID } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only run if gtag is available
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', 'G-50Y0Q2BGEQ');
    } else if (window.dataLayer) {
      // fallback for when gtag is not defined but dataLayer is
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-50Y0Q2BGEQ');
    }
  }, []);

  const { data: tripDetails } = useQuery(["trip", tripID], () =>
    getTrip(tripID)
  );

  const { data: userAvailability, isLoading: isAvailabilityLoading } = useQuery(
    ["userAvailability", tripID],
    () => getUserAvailability(tripID),
    {
      onSuccess: (data) => {
        setSelectedDates(new Set(data));
      },
    }
  );

  // Only compute userRole when both currentUser and tripDetails are available
  const userRole = useMemo(() => {
    if (!currentUser || !tripDetails?.users) return null;
    const userInTrip = tripDetails.users.find((u) => u.userID === currentUser);
    return userInTrip?.role;
  }, [currentUser, tripDetails]);

  const canModify = useMemo(() => canEdit(userRole), [userRole]);

  const { mutate: submitAvailability, isLoading: isSubmitting } = useMutation(
    () => updateAvailability(Array.from(selectedDates), tripID),
    {
      onSuccess: () => {
        toast.success("Availability successfully submitted!");
        queryClient.invalidateQueries(["userAvailability", tripID]);
        queryClient.invalidateQueries(["suggestedPeriods", tripID]);
        queryClient.invalidateQueries(["rangeAvailabilityUsernames", tripID]);
      },
      onError: (error) => {
        console.error("Error saving availability:", error.message);
        toast.error("Failed to submit availability", {
          description: <p>{error.message}</p>,
        });
      },
    }
  );

  const handleSubmit = () => {
    submitAvailability(null, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID} />
      {!isMobile && <SidebarTrigger />}
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
                        loading={isSubmitting}
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
            <div className="max-w-md md:max-w-5xl mx-auto p-5">
              <AvailableTrips
                tripID={tripID}
                durationFilter={durationFilter}
                setDurationFilter={setDurationFilter}
                isParentLoading={isAvailabilityLoading}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GrpSchedule;
