import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reorder } from "framer-motion";
import { Plus } from 'lucide-react'
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import ActivityCard from "./ActivityCard.jsx";
import AddActivityModal from "./AddActivityModal.jsx";
import EditActivityModal from "./EditActivityModal.jsx";
import MapboxMap from "../MapboxMap/MapboxMapV5.jsx";

function ItineraryWL() {
  const [days, setDays] = useState([
    {
      date: "Day 1",
      activities: [
        {
          id: "1",
          time: "08:00",
          type: "food",
          duration: "1",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "test",
        },
        {
          id: "2",
          time: "08:00",
          type: "food",
          duration: "1",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "",
        },
      ],
    },
    {
      date: "Day 2",
      activities: [
        {
          id: "3",
          time: "08:00",
          type: "food",
          duration: "1",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "",
        },
      ],
    },
    {
      date: "Day 3",
      activities: [
        {
          id: "4",
          time: "08:00",
          type: "food",
          duration: "1",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "",
        },
      ],
    },
  ]);

  const [addModalState, setAddModalState] = useState({ isOpen: false, selectedDay: null });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const [searchedPlace, setSearchedPlace] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  const handleSaveLocation = (place) => {
    setSavedLocation(place);
    setAddModalState({ isOpen: true, selectedDay: days[days.length-1].date });
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
        id: `${Date.now()}`,
        image: "./src/assets/dummy-image.jpg",
      });
      setDays(updatedDays);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      
      <div className="flex w-full">
        {/* Left side: Itinerary */}
        <div className="w-8/12 px-14 py-8 space-y-8 overflow-y-auto max-h-screen">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">East-Coast Road Trip</h1>
            <p className="text-sm text-muted-foreground">19 June 2024 to 23 June 2024</p>
          </div>
          {days.map((day, dayIndex) => (
            <div key={day.date} className="space-y-4">
              <h2 className="text-xl font-semibold">{day.date}</h2>
              <Reorder.Group
                axis="y"
                values={day.activities}
                onReorder={(newActivities) => updateActivities(newActivities, dayIndex)}
                className="space-y-4">
                {day.activities.map((activity) => (
                  <ActivityCard
                    key={activity.id} 
                    activity={activity}
                    onNoteChange={handleNoteChange}
                    onEditClick={() => handleEditClick(dayIndex, activity)}
                    onDeleteClick={() => handleDeleteClick(dayIndex, activity.id)}
                  />
                ))}
              </Reorder.Group>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setAddModalState({ isOpen: true, selectedDay: day.date })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          ))}
        </div>

        {/* Right side: Map */}
        <div className="w-5/13">
          <MapboxMap
            onSaveLocation={handleSaveLocation}
            onMapLoad={handleMapLoad}
            initialPlace={searchedPlace}
            height="800px" /> {/* Need a better way to adjust height, h-full won't work */}
        </div>
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

export default ItineraryWL;

