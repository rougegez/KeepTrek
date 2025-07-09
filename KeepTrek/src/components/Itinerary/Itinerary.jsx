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

  const { data: tripDetails } = useQuery(
    ["trip", tripID],
    () => getTrip(tripID),
    {
      suspense: true,
      staleTime: 1000 * 60 * 15, //  15 minutes
    }
  );

  const { days, setDays, readyState, getDayAndActivity, getDays, addActivity } =
    useItinerary();
  const { whosOnline } = useWhosOnline();

  const userRole = useMemo(() => {
    if (!currentUser || !tripDetails?.users) return null;
    const userInTrip = tripDetails.users.find((u) => u.userID === currentUser);
    console.log("User lookup:", { currentUser, userInTrip });
    return userInTrip?.role;
  }, [currentUser, tripDetails]);

  const canModify = canEdit(userRole);

  // Modified approach to map collapsing
  const collapseMapOnMobile = () => {
    if (isMobile && isMapExpanded) {
      setIsMapExpanded(false);
    }
  };

  // Simplify the scroll handler to be more aggressive
  useEffect(() => {
    const handleScroll = (e) => {
      // Don't interfere with button interactions
      if (e.target.closest && e.target.closest("button")) {
        return;
      }

      const position = window.scrollY;

      // Only handle map collapsing on desktop
      if (!isMobile) {
        // Auto-expand map when scrolling to top
        if (position < 50) {
          setIsMapExpanded(true);
        }
      }

      setLastScrollPosition(position);
      setScrollPosition(position);
    };

    // Use capture phase to ensure we catch the event first
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isMapExpanded, isMobile]);

  const getMapHeight = () => (isMapExpanded ? "65vh" : "10vh");

  const MapToggleButton = () => (
    <Button
      className="absolute right-4 -bottom-5 z-[100] rounded-full p-2 bg-white border border-gray-200 text-muted-foreground shadow-lg"
      onClick={(e) => {
        // Stop propagation to prevent other handlers from capturing this event
        e.stopPropagation();
        setIsMapExpanded(!isMapExpanded);
      }}
      style={{
        width: isMobile ? "44px" : "36px",
        height: isMobile ? "44px" : "36px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
      aria-label={isMapExpanded ? "Collapse Map" : "Expand Map"}
      title={isMapExpanded ? "Collapse Map" : "Expand Map"}
    >
      {isMapExpanded ? (
        <ChevronUp size={isMobile ? 24 : 20} />
      ) : (
        <ChevronDown size={isMobile ? 24 : 20} />
      )}
    </Button>
  );

  const HideMapButton = () => (
    <Button
      className="absolute left-4 top-1/2 -translate-y-1/2 z-[100] rounded-full w-10 h-10 p-0 flex items-center justify-center bg-secondary text-muted-foreground shadow-md"
      onClick={(e) => {
        e.stopPropagation();
        setIsMapVisible(false);
      }}
      title="Hide Map"
    >
      <ChevronRight size={20} />
    </Button>
  );

  const ShowMapButton = () => (
    <Button
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] rounded-full w-10 h-10 p-0 flex items-center justify-center bg-secondary text-muted-foreground shadow-md"
      onClick={(e) => {
        e.stopPropagation();
        setIsMapVisible(true);
      }}
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
    };
    addActivity(newActivity, selectedDay);
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

  // Prevent background scroll when map is expanded on mobile
  useEffect(() => {
    if (isMobile && isMapExpanded) {
      // Instead of preventing all scrolling, only prevent it on the body
      // but allow scrolling in the content area
      document.body.style.overflow = "auto";

      // Make sure the content area is scrollable
      if (contentRef.current) {
        contentRef.current.style.overflowY = "auto";
        contentRef.current.style.WebkitOverflowScrolling = "touch";
      }
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isMapExpanded]);

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
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            style={{ top: "3.5rem", flexShrink: 1 }}
          >
            <MapboxMap
              onSaveLocation={handleSaveLocation}
              onMapLoad={handleMapLoad}
              initCenter={tripDetails?.coordinates}
              initViewport={tripDetails?.viewport}
              handlePanTo={searchedPlace}
              height="100%"
              width="100%"
              disableSaveLocation={!canModify}
              disableSearchBar={!canModify}
              markers={normalizeMarkers(days)}
              itineraryDays={itineraryDays}
              locationBias={tripDetails?.viewport}
            />
            <MapToggleButton />
          </motion.div>
        ) : null}

        <motion.div
          ref={contentRef}
          className={`${
            isMobile
              ? "w-full bg-background relative z-30 overflow-y-auto"
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
          style={{
            flexShrink: 0,
            height: isMobile ? "calc(100vh - 3.5rem)" : "100vh",
          }}
        >
          <ScrollArea
            className={`${
              isMobile ? "h-[calc(100vh-3.5rem)]" : "h-full"
            } px-2 pt-6`}
          >
            <div className="space-y-6">
              <div
                className={`flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 py-2 mr-5 w-[98%]`}
              >
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate max-w-[350px] sm:max-w-[450px]  lg:max-w-[230px] xl:max-w-[200px] 2xl:max-w-[450px]">
                    {tripDetails.tripName.length > 40
                      ? tripDetails.tripName.slice(0, 40) + "..."
                      : tripDetails.tripName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {dateFormatter(tripDetails.startDate)} to{" "}
                    {dateFormatter(tripDetails.endDate)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    isMobile ? "flexitems-center gap-4" : ""
                  }`}
                  style={{ minWidth: 0, height: "auto" }}
                >
                  <UserAvatarStack
                    userIds={tripDetails.users}
                    isIdle={whosOnline}
                    size={isMobile ? 8 : 10}
                    maxUsers={isMobile ? 2 : 3}
                    className={isMobile ? "scale-90" : ""}
                  />
                  {canModify && (
                    <>
                      <InviteButton tripID={tripID} userRole={userRole} />
                      {tripDetails && <BrowseActivity location={tripDetails.location} />}
                    </>
                  )}
                  {userRole === UserRole.ADMIN && (
                    <Button
                      variant="outline"
                      onClick={() => setShowSettingsModal(true)}
                      title="Trip Settings"
                      aria-label="Trip Settings"
                    >
                      <Settings
                        className={`${isMobile ? "h-4 w-4" : "h-4 w-4"}`}
                      />
                    </Button>
                  )}
                  {currentUser && currentUser !== tripDetails.creatorID && (
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "icon"}
                      onClick={() => setShowLeaveAlert(true)}
                      title="Leave Trip"
                      aria-label="Leave Trip"
                      className="min-w-[40px]"
                    >
                      <LogOut
                        className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                      />
                    </Button>
                  )}
                </div>
              </div>
              {readyState === ReadyState.OPEN && days && days.length > 0 ? (
                days.map((day, dayIndex) => (
                  <div key={day.date} className="space-y-4">
                    <h2 className="text-xl font-semibold">{day.date}</h2>
                    <Reorder.Group
                      axis="y"
                      values={day.activities}
                      onReorder={(newActivities) =>
                        updateActivities(newActivities, dayIndex)
                      }
                      className={`space-y-4 ${
                        isMobile ? "w-full px-2" : "w-[90%] ml-14"
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
                        />
                      ))}
                    </Reorder.Group>
                    {canModify && (
                      <Button
                        variant="outline"
                        className={`${
                          isMobile
                            ? "w-full mt-2 mb-2 rounded-lg shadow"
                            : "w-[92%] ml-8 mt-2 mb-2 rounded-lg shadow"
                        }`}
                        onClick={() =>
                          setAddModalState({
                            isOpen: true,
                            selectedDay: day.date,
                          })
                        }
                        aria-label="Add Activity"
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
                  className={`w-full mt-4 mb-6 rounded-lg shadow ${
                    isMobile ? "mx-auto" : ""
                  }`}
                  onClick={() =>
                    setDays([
                      ...days,
                      { date: `Day ${days.length + 1}`, activities: [] },
                    ])
                  }
                  aria-label="Add Day"
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
              initViewport={tripDetails?.viewport}
              handlePanTo={searchedPlace}
              height="100%"
              width="100%"
              disableSaveLocation={!canModify}
              disableSearchBar={!canModify}
              markers={normalizeMarkers(days)}
              itineraryDays={itineraryDays}
              locationBias={tripDetails?.viewport}
            />
            <HideMapButton />
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
        locationBias={tripDetails?.viewport}
      />

      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentActivity(null);
        }}
        activityId={currentActivity?.id}
        locationBias={tripDetails?.viewport}
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
