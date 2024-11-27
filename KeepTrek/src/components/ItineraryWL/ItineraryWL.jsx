import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reorder } from "framer-motion";
import { Clock, MapPin, Pencil, X, Plus } from 'lucide-react'
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapTestPage } from "../MapboxMap/MapTestPage.jsx";
import MapSearchBar from "../MapboxMap/MapSearchbarGeoAPIV5.jsx"

function ItineraryWL() {
  const [days, setDays] = useState([
    {
      date: "Day 1",
      activities: [
        {
          id: "1",
          time: "8:00am",
          duration: "1 hr",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "", // Add notes field
        },
        {
          id: "2",
          time: "8:00am",
          duration: "1 hr",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "", // Add notes field
        },
      ],
    },
    {
      date: "Day 2",
      activities: [
        {
          id: "3",
          time: "8:00am",
          duration: "1 hr",
          title: "Breakfast @ Ying Her Kopitiam",
          location: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 41200 Kuantan",
          image: "./src/assets/dummy-image.jpg",
          notes: "", // Add notes field
        },
      ],
    },
  ]);

  // Function to handle updates to activity notes
  const handleNoteChange = (dayIndex, activityId, newNote) => {
    const newDays = [...days];
    const activity = newDays[dayIndex].activities.find((a) => a.id === activityId);
    if (activity) {
      activity.notes = newNote; // Update the notes field
    }
    setDays(newDays);
  };

  const updateActivities = (newActivities, dayIndex) => {
    const newDays = [...days];
    newDays[dayIndex].activities = newActivities;
    setDays(newDays);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
const [newActivity, setNewActivity] = useState({
  type: "food",
  title: "",
  location: "",
  notes: "",
});

const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  // Function to handle opening the edit modal
  const handleEditClick = (dayIndex, activity) => {
    setCurrentActivity({ ...activity, dayIndex }); // Pass the activity and the day index
    setIsEditModalOpen(true);
  };

  // Function to handle saving the edited activity
  const handleSaveEdit = () => {
    const updatedDays = [...days];
    const { dayIndex, id, title, location, notes } = currentActivity;
    const activityIndex = updatedDays[dayIndex].activities.findIndex((a) => a.id === id);

    if (activityIndex !== -1) {
      updatedDays[dayIndex].activities[activityIndex] = { ...currentActivity };
      setDays(updatedDays);
    }

    setIsEditModalOpen(false); // Close the modal
  };

  // Function to handle deleting an activity
  const handleDeleteClick = (dayIndex, activityId) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (activity) => activity.id !== activityId
    );
    setDays(updatedDays);
  };

  const [mapInstance, setMapInstance] = useState(null)
  const handleLocationSearch = (suggestion) => {
    if (suggestion && suggestion.center) {
        // Create a place object similar to what's used in MapboxMap
        const place = {
            name: suggestion.text,
            address: suggestion.place_name,
            coordinates: suggestion.center
        }

        // Set the selected place to trigger the card in MapboxMap
        setSearchedPlace(place)
    }

    // If using V6 API
    if (suggestion.properties && suggestion.properties.coordinates) {
        const place = {
            name: suggestion.properties.name,
            address: suggestion.properties.full_address || suggestion.properties.place_formatted,
            coordinates: suggestion.geometry.coordinates,
        }

        setSearchedPlace(place)
    }
}

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
                  <Reorder.Item key={activity.id} value={activity} className="relative">
                    <div className="absolute left-0 -ml-24 top-12 flex flex-col space-y-1 text-sm text-muted-foreground px-10">
                    <div className="font-medium">{activity.time}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {activity.duration}
                    </div>
                  </div>
                  <Card className="bg-white rounded-xl shadow-sm w-full max-w-4xl">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-grow space-y-2">
                          <h3 className="text-lg font-semibold">{activity.title}</h3>
                          <div className="flex items-start gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{activity.location}</span>
                          </div>
                          <textarea
                            className="w-full min-h-[50px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
                            placeholder="Add a note..."
                            value={activity.notes}
                            onChange={(e) => handleNoteChange(dayIndex, activity.id, e.target.value)}
                          />
                        </div>
                        <div className="flex-none">
                          <img
                            src={activity.image}
                            alt=""
                            className="w-48 h-28 rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="absolute -right-10 top-10 flex flex-col gap-4">
                  <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition-colors"
                    onClick={() => handleEditClick(dayIndex, activity)}>
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                    onClick={() => handleDeleteClick(dayIndex, activity.id)}>
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          ))}
        </div>

        {/* Right side: Map */}
        <div className="w-5/13">
          <MapTestPage />
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Add Activity</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Activity Type */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Activity Type</label>
        <Select
          value={newActivity.type}
          onValueChange={(value) =>
            setNewActivity((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger className="w-full">
            <span>{newActivity.type}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stay">Stay</SelectItem>
            <SelectItem value="outdoor">Outdoor</SelectItem>
            <SelectItem value="indoor">Indoor</SelectItem>
            <SelectItem value="food">Food</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Name */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Activity Name</label>
        <Input
          type="text"
          placeholder="Enter activity name"
          value={newActivity.title}
          onChange={(e) =>
            setNewActivity((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Address</label>
        {/* <Input
          type="text"
          placeholder="Enter address"
          value={newActivity.location}
          onChange={(e) =>
            setNewActivity((prev) => ({ ...prev, location: e.target.value }))
          }
        ></Input> */}
        <MapSearchBar 
        mapInstance={mapInstance}
        onLocationSearch={handleLocationSearch} />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Notes</label>
        <textarea
          className="w-full min-h-[80px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
          placeholder="Add some notes..."
          value={newActivity.notes}
          onChange={(e) =>
            setNewActivity((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            // Add the new activity
            const updatedDays = [...days];
            updatedDays[0].activities.push({
              ...newActivity,
              id: `${Date.now()}`, // Generate a unique ID
              time: "8:00am", // Default time
              duration: "1 hr", // Default duration
              image: "./src/assets/dummy-image.jpg", // Default image
            });
            setDays(updatedDays);

            // Reset modal state
            setNewActivity({ type: "food", title: "", location: "", notes: "" });
            setIsModalOpen(false);
          }}
        >
          Add Activity
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

{/* Edit Modal */}
<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Activity Name</label>
              <Input
                type="text"
                value={currentActivity?.title || ""}
                onChange={(e) =>
                  setCurrentActivity((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Address</label>
              <Input
                type="text"
                value={currentActivity?.location || ""}
                onChange={(e) =>
                  setCurrentActivity((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Notes</label>
              <textarea
                className="w-full min-h-[80px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
                value={currentActivity?.notes || ""}
                onChange={(e) =>
                  setCurrentActivity((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

export default ItineraryWL;