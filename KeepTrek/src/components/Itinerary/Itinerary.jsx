import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "react-query";
import { withSuspense } from "@/utils/withSuspense.jsx";

import { Button } from "@/components/ui/button";
import { Reorder } from "framer-motion";
import {
  Plus,
  ChevronUp,
  ChevronDown,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ActivityCard from "./ActivityCard.jsx";
import AddActivityModal from "./AddActivityModal.jsx";
import EditActivityModal from "./EditActivityModal.jsx";
import MapboxMap from "@/components/MapboxMap/MapboxMapGoogleSearch.jsx";
import { normalizeMarkers } from "@/components/MapboxMap/MapUtil.jsx";
import { dateFormatter } from "@/utils/dateFormat.jsx";

import { useParams, useNavigate } from "react-router-dom";
import { getTrip, removeMember } from "@/APIs/trip.js";

import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import MobileHeader from "../MobileHeader.jsx";
import InviteButton from "../Invite/InviteButton.jsx";
import BrowseActivity from "../BrowseActivity/BrowseActivity.jsx";
import { UserAvatarStack } from "../profilePage/avatar.jsx";
import { ScrollArea } from "@/components/ui/scroll-area";

import { canEdit, UserRole } from "@/utils/permissions";
import LeaveAlert from "@/components/ui/LeaveAlert";
import TripSettings from "../TripSettings/TripSettings.jsx";

import { useItinerary } from "@/hooks/useItinerary.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { ReadyState } from "react-use-websocket";
import { useAuth } from "@/contexts/AuthProvider.jsx";
import { useWhosOnline } from "../CreateTrip/WhosOnlineWrapper.jsx";
import DeleteAlert from "../ui/DeleteAlert.jsx";
import { toast } from "sonner";

function Itinerary() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { tripID } = useParams();

  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    selectedDay: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [currentActivity, setCurrentActivity] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width: 1170px)" });
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const { data: tripDetails } = useQuery(
    ["trip", tripID],
    () => getTrip(tripID),
    {
      suspense: true,
      staleTime: 1000 * 60 * 15, //  15 minutes
    }
  );

  const { days, setDays, readyState, getDayAndActivity, getDays, addActivity } = useItinerary()
  const { whosOnline } = useWhosOnline();

  const userRole = useMemo(() => {
    if (!currentUser || !tripDetails?.users) return null;
    const userInTrip = tripDetails.users.find((u) => u.userID === currentUser);
    console.log("User lookup:", { currentUser, userInTrip });
    return userInTrip?.role;
  }, [currentUser, tripDetails]);

  const canModify = canEdit(userRole);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const scrollDelta = position - lastScrollPosition;

      // Auto-expand map when scrolling to top (desktop only)
      if (!isMobile && position < 50) {
        setIsMapExpanded(true);
      }
      // Auto-collapse map when scrolling down past threshold
      else if (scrollDelta > 10 && position > 10 && isMapExpanded) {
        setIsMapExpanded(false);
      }

      setLastScrollPosition(position);
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMapExpanded, lastScrollPosition, isMobile]);

  const getMapHeight = () => (isMapExpanded ? "65vh" : "10vh");

  const MapToggleButton = () => (
    <Button
      className="absolute right-4 -bottom-5 z-50 rounded-full p-2 bg-secondary text-muted-foreground shadow-md"
      onClick={() => setIsMapExpanded(!isMapExpanded)}
    >
      {isMapExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </Button>
  );

  const HideMapButton = () => (
    <Button
      className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full w-10 h-10 p-0 flex items-center justify-center bg-secondary text-muted-foreground shadow-md"
      onClick={() => setIsMapVisible(false)}
      title="Hide Map"
    >
      <ChevronRight size={20} />
    </Button>
  );

  const ShowMapButton = () => (
    <Button
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 rounded-full w-10 h-10 p-0 flex items-center justify-center bg-secondary text-muted-foreground shadow-md"
      onClick={() => setIsMapVisible(true)}
      title="Show Map"
    >
      <ChevronLeft size={20} />
    </Button>
  );

  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const handleSaveLocation = (place, selectedDay) => {
    const newActivity = {
      id: `${Date.now()}`,
      title: place ? place.name : "",
      placeId: place ? place.placeId : "",
      location: place ? place.address : "",
      coordinates: place ? place.coordinates : [],
      rating: place ? place.rating : "",
      image: place ? place.image : "/assets/dummy-image.jpg",
      openingHours: place ? place.openingHours : "",
      website: place ? place.website : "",
      link: place ? place.link : "",
    }
    addActivity(newActivity, selectedDay)
    if (readyState === ReadyState.OPEN) {
      toast.success("Activity added successfully!");
    }
  };

  const handleNoteChange = (activityId, newNote) => {
    const updatedDays = days.map((day) => ({
      ...day,
      activities: day.activities.map((activity) =>
        activity.id === activityId ? { ...activity, notes: newNote } : activity
      ),
    }));
    setDays(updatedDays);
  };

  const updateActivities = (newActivities, dayIndex) => {
    const newDays = [...days];
    newDays[dayIndex].activities = newActivities;
    setDays(newDays);
  };

  const handleEditClick = (dayIndex, activity) => {
    setCurrentActivity({ ...activity, day: days[dayIndex].date });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (dayIndex, activityId) => {
    const { activity } = getDayAndActivity(activityId);
    setCurrentActivity({ dayIndex: dayIndex, activity: activity });
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    const { activity: deleteActivity, dayIndex } = currentActivity;
    const updatedDays = [...days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (activity) => activity.id !== deleteActivity.id
    );
    setDays(updatedDays);
    setIsDeleteConfirmOpen(false);
    setCurrentActivity(null);
  };

  const handleAddActivity = (newActivity, selectedDay) => {
    console.log(newActivity, selectedDay);
    const updatedDays = [...days];
    const dayIndex = updatedDays.findIndex((day) => day.date === selectedDay);
    if (dayIndex !== -1) {
      updatedDays[dayIndex].activities.push({
        ...newActivity,
        id: `${Date.now()}`,
      });
      setDays(updatedDays);
    }
    if (readyState === ReadyState.OPEN) {
      toast.success("Activity added successfully!");
    }
  };

  const handleLocationClick = (clickLocation) => {
    clickLocation.address = clickLocation.location;
    clickLocation.name = clickLocation.title;
    const random = new Date().getTime();
    setSearchedPlace({ random, clickLocation });
  };

  const handleLeave = async () => {
    try {
      await removeMember(tripID, currentUser);
      navigate("/yourTrips", { replace: true });
    } catch (error) {
      console.error("Error leaving trip:", error);
    }
  };

  const itineraryDays = getDays();

  return (
    <SidebarProvider>
      <AppSidebar tripID={tripID} />
      {!isMobile && <SidebarTrigger />}
      {isMobile && <MobileHeader title="Itinerary" />}
      <div
        className={`flex w-full ${
          !isMobile && isMapVisible && "grid grid-cols-2"
        }`}
      >
        {!isMobile && !isMapVisible && <ShowMapButton />}

        {isMobile ? (
          <motion.div
            className="fixed w-full z-40 bg-background"
            initial={{ height: "75vh" }}
            animate={{
              height: getMapHeight(),
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            style={{ top: "3.5rem", flexShrink: 1 }}
          >
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              initCenter={tripDetails?.coordinates}
              handlePanTo={searchedPlace}
              height="100%"
              width="100%"
              disableSaveLocation={!canModify}
              disableSearchBar={!canModify}
              markers={normalizeMarkers(days)}
              itineraryDays={itineraryDays}
            />
            <MapToggleButton />
          </motion.div>
        ) : null}

        <motion.div
          ref={contentRef}
          className={`${
            isMobile
              ? "w-full bg-background relative z-30"
              : isMapVisible
              ? "col-span-1 h-screen"
              : "col-span-2 h-screen mx-auto max-w-4xl large-mode"
          }`}
          animate={
            isMobile
              ? {
                  marginTop: `calc(${getMapHeight()} + 3.5rem)`, // Add header height to margin
                  transition: { duration: 0.3, ease: "easeInOut" },
                }
              : {}
          }
          style={{ flexShrink: 0 }}
        >
          <ScrollArea className="h-full px-2 pt-6">
            <div className="space-y-6">
              <div className="flex justify-between space-y-2 mr-5">
                <div>
                  <h1 className="text-3xl font-bold truncate">
                    {tripDetails.tripName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {dateFormatter(tripDetails.startDate)} to{" "}
                    {dateFormatter(tripDetails.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">

                  <UserAvatarStack
                    userIds={tripDetails.users}
                    isIdle={whosOnline}
                  />

                  {canModify && (
                    <>
                      <InviteButton tripID={tripID} userRole={userRole} />
                      <BrowseActivity location={tripDetails.location} />
                    </>
                  )}
                  {userRole === UserRole.ADMIN && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowSettingsModal(true)}
                      title="Trip Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  {currentUser && currentUser !== tripDetails.creatorID && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowLeaveAlert(true)}
                      title="Leave Trip"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {readyState === ReadyState.OPEN && days && days.length > 0 ? (
                days.map((day, dayIndex) => (
                  <div key={day.date} className="space-y-4">
                    <h2
                      className={`text-xl font-semibold ${
                        !isMapVisible && !isMobile ? "text-2xl" : ""
                      }`}
                    >
                      {day.date}
                    </h2>
                    <Reorder.Group
                      axis="y"
                      values={day.activities}
                      onReorder={(newActivities) =>
                        updateActivities(newActivities, dayIndex)
                      }
                      className={`space-y-4 w-[98%] md:w-[90%] ml-0 md:ml-14 ${
                        !isMapVisible && !isMobile ? "space-y-6" : ""
                      }`}
                    >
                      {day.activities.map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          onNoteChange={handleNoteChange}
                          onEditClick={() =>
                            handleEditClick(dayIndex, activity)
                          }
                          onDeleteClick={() =>
                            handleDeleteClick(dayIndex, activity.id)
                          }
                          onLocationClick={(clickLocation) =>
                            handleLocationClick(clickLocation)
                          }
                          canModify={canModify}
                          largeMode={!isMapVisible && !isMobile}
                        />
                      ))}
                    </Reorder.Group>
                    {canModify && (
                      <Button
                        variant="outline"
                        className={`w-[98%] md:w-[92%] ml-0 md:ml-8 ${
                          !isMapVisible && !isMobile ? "text-lg py-6" : ""
                        }`}
                        onClick={() =>
                          setAddModalState({
                            isOpen: true,
                            selectedDay: day.date,
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <ItinerarySkeleton />
              )}
              {canModify && (
                <Button
                  variant="outline"
                  className={`w-full ${
                    !isMapVisible && !isMobile ? "text-lg py-6" : ""
                  }`}
                  onClick={() =>
                    setDays([
                      ...days,
                      { date: `Day ${days.length + 1}`, activities: [] },
                    ])
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              )}
            </div>
          </ScrollArea>
        </motion.div>

        {!isMobile && isMapVisible && (
          <div className="col-span-1 h-screen sticky top-0 relative">
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              initCenter={tripDetails?.coordinates}
              handlePanTo={searchedPlace}
              height="100%"
              width="100%"
              disableSaveLocation={!canModify}
              disableSearchBar={!canModify}
              markers={normalizeMarkers(days)}
              itineraryDays={itineraryDays}
            />
            <HideMapButton />
            <MapToggleButton />
          </div>
        )}
      </div>

      <AddActivityModal
        key={`${savedLocation}${addModalState.selectedDay}`}
        isOpen={addModalState.isOpen}
        selectedDay={addModalState.selectedDay}
        onClose={() => {
          setAddModalState({ isOpen: false });
          setSavedLocation(null);
        }}
        onAddActivity={handleAddActivity}
        location={savedLocation}
        days={days}
      />

      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentActivity(null);
        }}
        activityId={currentActivity?.id}
      />

      <DeleteAlert
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentActivity?.activity?.title}
      />

      <LeaveAlert
        isOpen={showLeaveAlert}
        onClose={() => setShowLeaveAlert(false)}
        onConfirm={handleLeave}
      />

      <TripSettings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        tripID={tripID}
      />
    </SidebarProvider>
  );
}

function ItinerarySkeleton() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="animate-pulse space-y-4">
      {/* Day heading skeleton */}
      <Skeleton className="h-6 w-1/3" />

      {/* Activity card skeletons */}
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm w-full max-w-4xl p-4"
        >
          {isMobile ? (
            /* Mobile layout: image on top, then text */
            <div className="w-full relative space-y-2">
              <Skeleton className="w-full h-32 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-16" />
              </div>
            </div>
          ) : (
            /* Desktop layout: text on left, image on right */
            <div className="flex gap-4">
              <div className="flex-grow space-y-4">
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-16" />
              </div>
              <Skeleton className="w-48 h-28 rounded-lg" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default withSuspense(Itinerary);
