import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import MapSearchBar from "../MapboxMap/MapSearchbarGeoAPIV5";

const EditActivityModal = ({ isOpen, onClose, currentActivity, onSaveEdit, days}) => {
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
      location: newLocation
    }));
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

          <div>
            <label htmlFor="activity-duration" className="block text-sm font-medium text-muted-foreground mb-1">Duration</label>
            <Input
              id="activity-duration"
              type="text"
              placeholder="e.g., 1 hr"
              value={editedActivity.duration}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, duration: e.target.value })
              }
            />
          </div>

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

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
            <MapSearchBar
              id="address"
              searchButton={false}
              onChange={handleLocationChange}
              initialPlace={editedActivity.location}
            />
          </div>

          <div>
            <label htmlFor="activity-notes" className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
            <textarea
              id="activity-notes"
              className="w-full min-h-[80px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
              value={editedActivity.notes}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, notes: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setEditedActivity(null);
              onClose();
            }}>
              Cancel
            </Button>
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

