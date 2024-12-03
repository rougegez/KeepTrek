import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import MapSearchBar from "../MapboxMap/MapSearchbarGeoAPIV5";
import { Textarea } from '@/components/ui/textarea';

const EditActivityModal = ({ isOpen, onClose, currentActivity, onSaveEdit, days }) => {
  const [editedActivity, setEditedActivity] = useState(null);

  useEffect(() => {
    if (isOpen && currentActivity) {
      setEditedActivity(currentActivity);
    }
  }, [isOpen, currentActivity]);

  if (!editedActivity) return null;

  const handleDayChange = (newDay) => {
    setEditedActivity(prev => ({
      ...prev,
      day: newDay
    }));
  };

  const handleLocationChange = (newLocation) => {
    setEditedActivity(prev => ({
      ...prev,
      location: newLocation.place_name,
      coordinates: newLocation.center
    }));
  };

  const handleDurationChange = (e) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === '') {
        setEditedActivity({ ...editedActivity, duration: '' })
      return;
    }

    // Convert to number for validation
    const numberValue = parseFloat(inputValue);

    // Check if the value is a valid number, positive, within range, and in 0.5 increments
    if (
      !isNaN(numberValue) &&
      numberValue >= 0 &&
      numberValue <= 99.5 &&
      numberValue * 2 === Math.round(numberValue * 2) // Check for increments of 0.5
    ) {
      setEditedActivity({ ...editedActivity, duration: inputValue });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setEditedActivity(null);
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>


        <div className="space-y-4">
        {/*Select Day*/}
          <div>
            <label htmlFor="day-select" className="block text-sm font-medium text-muted-foreground mb-1">Day</label>
            <Select
              value={editedActivity.day}
              onValueChange={handleDayChange}
            >
              <SelectTrigger id="day-select" className="w-full">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day, index) => (
                  <SelectItem key={index} value={day.date}>
                    {day.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/*Select Activity Type*/}
          <div>
            <label htmlFor="activity-type" className="block text-sm font-medium text-muted-foreground mb-1">Activity Type</label>
            <Select
              value={editedActivity.type}
              onValueChange={(value) =>
                setEditedActivity({ ...editedActivity, type: value })
              }
            >
              <SelectTrigger id="activity-type" className="w-full">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stay">Stay</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select Time */}
          <div>
            <label htmlFor="activity-time" className="block text-sm font-medium text-muted-foreground mb-1">Time</label>
            <Input
              id="activity-time"
              type="time"
              value={editedActivity.time}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, time: e.target.value })
              }
            />
          </div>

          {/* Input Duration */}
          <div>
            <label htmlFor="activity-duration" className="block text-sm font-medium text-muted-foreground mb-1">Duration (in hours)</label>
            <Input
              id="activity-duration"
              type="text"
              placeholder="e.g. 0.5, 1, 1.5"
              value={editedActivity.duration}
              onChange={handleDurationChange}
            />
          </div>

          {/* Input Title  */}
          <div>
            <label htmlFor="activity-name" className="block text-sm font-medium text-muted-foreground mb-1">Activity Name</label>
            <Input
              id="activity-name"
              type="text"
              value={editedActivity.title}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, title: e.target.value })
              }
            />
          </div>

          {/* Search Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
            <MapSearchBar
              id="address"
              searchButton={false}
              onChange={handleLocationChange}
              initialPlace={editedActivity.location}
            />
          </div>

          {/* Input Notes */}
          <div>
            <label htmlFor="activity-notes" className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
            <Textarea
              id="activity-notes"
              className="w-full min-h-[80px] p-2 text-sm bg-white rounded-lg resize-none placeholder:text-muted-foreground/50"
              value={editedActivity.notes}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, notes: e.target.value })
              }
            />
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setEditedActivity(null);
              onClose();
            }}>
              Cancel
            </Button>

            {/* Save Button */}
            <Button onClick={() => {
              onSaveEdit(editedActivity);
              setEditedActivity(null);
              onClose();
            }}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityModal;

