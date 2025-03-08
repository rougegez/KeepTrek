import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { withSuspense } from "@/utils/withSuspense.jsx";

import { Button } from "@/components/ui/button";
import { Reorder } from "framer-motion";
import { Plus, Menu, ChevronUp, ChevronDown } from 'lucide-react'
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ActivityCard from "./ActivityCard.jsx";
import AddActivityModal from "./AddActivityModal.jsx";
import EditActivityModal from "./EditActivityModal.jsx";
import MapboxMap from "../MapboxMap/MapboxMapGoogleSearch.jsx";
import { dateFormatter } from "@/utils/dateFormat.jsx";

import { useParams } from "react-router-dom";
import { createItinerary, getItinerary, updateItinerary } from "@/APIs/itinerary.js";
import { getTrip } from "@/APIs/trip.js";
import { Card, CardContent } from "../ui/card.jsx";
import { useMediaQuery } from 'react-responsive';
import { motion } from "framer-motion";
import MobileHeader from "../MobileHeader";
import InviteButton from "../Invite/InviteButton.jsx";
import { UserAvatarStack } from '../profilePage/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function ItineraryWL() {
  const queryClient = useQueryClient();
  const { tripID } = useParams();

  const [addModalState, setAddModalState] = useState({ isOpen: false, selectedDay: null });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [currentActivity, setCurrentActivity] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const scrollDelta = position - lastScrollPosition;
      
      // Auto-expand map when scrolling to top
      if (position < 50) {
        setIsMapExpanded(true);
      }
      // Auto-collapse map when scrolling down past threshold
      else if (scrollDelta > 10 && position > 10 && isMapExpanded) {
        setIsMapExpanded(false);
      }
      // Auto-expand map when scrolling up quickly
      //else if (scrollDelta < -50 && !isMapExpanded) {
      //  setIsMapExpanded(true);
      //}
      
      setLastScrollPosition(position);
      setScrollPosition(position);
    };

    const activityCardContentStyle = {
    display: 'flex',
    gap: '1rem',
    flexDirection: isMobile ? 'column' : 'row',
  };

  const activityImageStyle = {
    maxWidth: '30rem',
    maxHeight: '10rem',
    borderRadius: '0.5rem',
    objectFit: 'cover',
    width: isMobile ? '100%' : 'auto',
    height: isMobile ? 'auto' : 'auto',
  };

  const cardStyle = {
    maxWidth: isMobile ? '20rem' : '100%',
  };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMapExpanded, lastScrollPosition]);

  const getMapHeight = () => isMapExpanded ? '65vh' : '10vh';

  const MapToggleButton = () => (
    <Button
      className="absolute right-4 -bottom-5 z-50 rounded-full p-2 bg-secondary text-muted-foreground shadow-md"
      onClick={() => setIsMapExpanded(!isMapExpanded)}
    >
      {isMapExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </Button>
  );

  const { data: tripDetails } = useQuery(
    ['trip', tripID],
    () => getTrip(tripID),
    { suspense: true }
  );

  const { data: itinerary} = useQuery(
    ['itinerary', tripID],
    () => getItinerary(tripID),
    { suspense: true}
  );

  const [days, setDays] = useState(itinerary.days);

  // Mutation to update the entire itinerary
  const updateItineraryMutation = useMutation(
    (updatedDays) => updateItinerary(tripID, { days: updatedDays }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['itinerary', tripID]);
        setLastSavedAt(new Date());
        setIsSaving(false);
      },
      onError: () => {
        setIsSaving(false);
      }
    }
  );

  const handleUpdateItinerary = async (updatedDays) => {
    setIsSaving(true);
    updateItineraryMutation.mutate(updatedDays);
  };

  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const handleSaveLocation = (place) => {
    setSavedLocation(place);
    setAddModalState({ isOpen: true, selectedDay: days[days.length - 1].date });
  };

  const handleNoteChange = (activityId, newNote) => {
    const updatedDays = days.map(day => ({
      ...day,
      activities: day.activities.map(activity =>
        activity.id === activityId ? { ...activity, notes: newNote } : activity
      )
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

  const handleSaveEdit = (editedActivity) => {
    const updatedDays = days.map(day => {
      if (day.date === editedActivity.day) {
        const activityIndex = day.activities.findIndex(a => a.id === editedActivity.id);
        if (activityIndex !== -1) {
          // If the activity is found, update it in place
          const updatedActivities = [...day.activities];
          updatedActivities[activityIndex] = editedActivity;
          return { ...day, activities: updatedActivities };
        } else {
          // If the activity is not found (day changed), add it to the end
          return { ...day, activities: [...day.activities, editedActivity] };
        }
      } else {
        // Remove the activity if it was moved to a different day
        return {
          ...day,
          activities: day.activities.filter(a => a.id !== editedActivity.id)
        };
      }
    });
    setDays(updatedDays);
    setIsEditModalOpen(false);
    setCurrentActivity(null);
  };


  const handleDeleteClick = (dayIndex, activityId) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (activity) => activity.id !== activityId
    );
    setDays(updatedDays);
  };

  const handleAddActivity = (newActivity) => {
    const updatedDays = [...days];
    const dayIndex = updatedDays.findIndex(day => day.date === newActivity.day);
    if (dayIndex !== -1) {
      updatedDays[dayIndex].activities.push({
        ...newActivity,
        id: `${Date.now()}`
      });
      setDays(updatedDays);
    }
  };

  const handleLocationClick = (clickLocation) => {
    clickLocation.address = clickLocation.location
    clickLocation.name = clickLocation.title
    const random = new Date().getTime()
    setSearchedPlace({random, clickLocation})
  }

  return (
      <SidebarProvider >
        <AppSidebar tripID={tripID} />
        {!isMobile && <SidebarTrigger />}
        {isMobile && <MobileHeader title="Itinerary" />}
        <div className={`flex w-full ${!isMobile && 'grid grid-cols-2'}`}>
          {isMobile ? (
            <motion.div
              className="fixed w-full z-40 bg-background"
              initial={{ height: '75vh' }}
              animate={{ 
                height: getMapHeight(),
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              style={{ top: '3.5rem', flexShrink: 1 }}
            >
              <MapboxMap
                onSaveLocation={handleSaveLocation}
                onMapLoad={handleMapLoad}
                initialPlace={searchedPlace}
                height="100%"
                width="100%"
              />
              <MapToggleButton />
            </motion.div>
          ) : null}

          <motion.div 
            ref={contentRef}
            className={`${
              isMobile 
                ? 'w-full bg-background relative z-30' 
                : 'col-span-1 h-screen'
            }`}
            animate={isMobile ? {
              marginTop: `calc(${getMapHeight()} + 3.5rem)`, // Add header height to margin
              transition: { duration: 0.3, ease: 'easeInOut' }
            } : {}}
            style={{ flexShrink: 0 }}
          >
            <ScrollArea className={`${isMobile ? 'p-4' : 'h-full px-2 pt-6'}`}>
              <div className="space-y-6">
                <div className="flex justify-between space-y-2 mr-5">
                  <div>
                    <h1 className="text-3xl font-bold truncate">{tripDetails.tripName}</h1>
                    <p className="text-sm text-muted-foreground">
                      {dateFormatter(tripDetails.startDate)} to {dateFormatter(tripDetails.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserAvatarStack userIds={tripDetails.users} />
                    <InviteButton tripID={tripID} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => handleUpdateItinerary(days)}
                      disabled={isSaving}
                    >
                      {isSaving ? <LoadingSpinner /> : 'Save'}
                    </Button>
                    {lastSavedAt && (
                      <span className="text-sm text-muted-foreground">
                        Last saved at: {lastSavedAt.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {days.map((day, dayIndex) => (
                  <div key={day.date} className="space-y-4">
                    <h2 className="text-xl font-semibold">{day.date}</h2>
                    <Reorder.Group
                      axis="y"
                      values={day.activities}
                      onReorder={(newActivities) => updateActivities(newActivities, dayIndex)}
                      className="space-y-4 w-[85%] ml-15">
                      {day.activities.map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          onNoteChange={handleNoteChange}
                          onEditClick={() => handleEditClick(dayIndex, activity)}
                          onDeleteClick={() => handleDeleteClick(dayIndex, activity.id)}
                          onLocationClick={(clickLocation) => handleLocationClick(clickLocation)}
                        />
                      ))}
                    </Reorder.Group>
                    <Button
                      variant="outline"
                      className="w-[92%] ml-8"
                      onClick={() => setAddModalState({ isOpen: true, selectedDay: day.date })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDays([...days, { date: `Day ${days.length + 1}`, activities: [] }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </div>
            </ScrollArea>
          </motion.div>

          {!isMobile && (
            <div className="col-span-1 h-screen sticky top-0">
              <MapboxMap
                onSaveLocation={handleSaveLocation}
                onMapLoad={handleMapLoad}
                initialPlace={searchedPlace}
                height="100%"
                width="100%"
              />
            </div>
          )}
        </div>

        <AddActivityModal
          isOpen={addModalState.isOpen}
          onClose={() => {
            setAddModalState({ isOpen: false, selectedDay: null });
            setSavedLocation(null);
          }}
          onAddActivity={handleAddActivity}
          mapInstance={mapInstance}
          location={savedLocation}
          days={days}
          selectedDay={addModalState.selectedDay}
        />

        <EditActivityModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentActivity(null);
          }}
          currentActivity={currentActivity}
          onSaveEdit={handleSaveEdit}
          days={days}
        />
      </SidebarProvider>
  );
}

export default withSuspense(ItineraryWL);

