import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar.jsx";
import { Textarea } from '@/components/ui/textarea';
import { fetchPlaceDetails } from '@/APIs/fetchPlaceDetails.js';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useItinerary } from '../../hooks/useItinerary.jsx';

const EditActivityModal = ({ isOpen, onClose, activityId, locationBias}) => {
  const {days, getDayAndActivity: getActivity , updateActivity, changeActivityDay} = useItinerary();
  const { date: foundDate, day: foundDay, activity: activity} = getActivity(activityId) || {};
  const [durationError, setDurationError] = useState(false);

  if (!activity) return null;

  const handleLocationChange = async (newLocation) => {
    if (newLocation?.placePrediction?.structuredFormat?.mainText?.text) {
      const suggestion = await fetchPlaceDetails(newLocation.placePrediction.placeId)
      updateActivity({
        ...activity,
        placeId : suggestion?.placeId ?? "",
        location: suggestion?.address ?? "",
        coordinates: suggestion?.coordinates ?? [],
        viewport: suggestion?.viewport ?? null,
        rating: suggestion?.rating ?? "",
        openingHours: suggestion?.openingHours ?? "",
        website: suggestion?.website ?? "",
        link: suggestion?.link ?? "",
        image: suggestion?.image ?? "../src/assets/dummy-image.jpg"
      });
    } else {
      updateActivity({
        ...activity,
        placeId : "",
        location: newLocation,
        coordinates: [],
        viewport: null,
        rating: "",
        openingHours: "",
        website: "",
        link: "",
        image: "../src/assets/dummy-image.jpg"
      });
    }
  }

  const handleDurationChange = (e) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === '') {
      updateActivity({ ...activity, duration: '' })
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
      updateActivity({ ...activity, duration: inputValue });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="rounded-lg max-w-lg sm:max-w-lg w-[90vw] max-w-sm p-4 sm:p-6 max-h-[80vh] sm:max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] sm:h-auto pr-2">
        <div className="space-y-4">
          {/*Select Day*/}
          <div>
            <label htmlFor="day-select" className="block text-sm font-medium text-muted-foreground mb-1">Day</label>
            <Select
              value={foundDate}
              onValueChange={(newDay) => changeActivityDay(activity, newDay)}
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
              value={activity.type}
              onValueChange={(value) => {
                updateActivity({ ...activity, type: value });
              }
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
              value={activity.time}
              onChange={(e) =>
                updateActivity({ ...activity, time: e.target.value })
              }
            />
          </div>

          {/* Input Duration */}
          <div>
            <label htmlFor="activity-duration" className="block text-sm font-medium text-muted-foreground mb-1">Duration (in hours)</label>
            <Input
              id="activity-duration"
              type="text"
              inputMode="decimal"
              pattern="^\\d{0,2}(\\.5)?$"
              placeholder="e.g. 0.5, 1, 1.5"
              value={activity.duration}
              className={durationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              onChange={(e) => {
                // Remove all non-numeric and non-dot characters
                let value = e.target.value.replace(/[^\d.]/g, '');
                // Only allow one dot
                const parts = value.split('.');
                if (parts.length > 2) {
                  value = parts[0] + '.' + parts.slice(1).join('');
                }
                // Prevent leading dot
                if (value.startsWith('.')) value = '';
                // Prevent more than 2 digits before dot
                if (parts[0].length > 2) value = value.slice(0, 2) + (parts[1] ? '.' + parts[1] : '');
                // Only allow .5 as decimal
                if (parts[1] && parts[1] !== '5') value = parts[0] + '.5';
                // Prevent 24 or above
                const num = parseFloat(value);
                if (!isNaN(num) && num >= 24) {
                  setDurationError(true);
                  return;
                } else {
                  setDurationError(false);
                }
                updateActivity({ ...activity, duration: value });
              }}
            />
            {durationError && (
              <div className="text-xs text-red-600 mt-1">Duration cannot be 24 hours or more.</div>
            )}
          </div>

          {/* Input Title  */}
          <div>
            <label htmlFor="activity-name" className="block text-sm font-medium text-muted-foreground mb-1">Activity Name</label>
            <Input
              id="activity-name"
              type="text"
              value={activity.title}
              onChange={(e) =>
                updateActivity({ ...activity, title: e.target.value })
              }
            />
          </div>

          {/* Search Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
            <MapSearchBar
              id="address"
              searchButton={false}
              onInputChange={handleLocationChange}
              initialPlace={activity.location}
              locationBias={locationBias}
            />
          </div>

          <div className="flex justify-end gap-2">

            {/* Close Button */}
            <Button onClick={() => {
              onClose();
            }}>Close</Button>
          </div>

        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityModal;

