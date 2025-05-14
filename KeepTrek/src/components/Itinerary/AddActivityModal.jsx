import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar";
import { Textarea } from '@/components/ui/textarea';
import { fetchPlaceDetails } from "@/APIs/fetchPlaceDetails.js";

const AddActivityModal = ({ isOpen, selectedDay, onClose, onAddActivity, location, days }) => {
    const [newActivity, setNewActivity] = useState(location ? {
        title: location ? location.name : "",
        placeId: location ? location.placeId : "",
        location: location ? location.address : "",
        coordinates: location ? location.coordinates : [],
        rating: location ? location.rating : "",
        image: location ? location.image : "../src/assets/dummy-image.jpg",
        openingHours: location ? location.openingHours : "",
        website: location ? location.website : "",
        link: location ? location.link : "",
    } : {
        type: "",
        time: "",
        duration: "",
        title: "",
        placeId: "",
        location: "",
        coordinates: [],
        rating: "",
        openingHours: "",
        website: "",
        link: "",
        image: "../src/assets/dummy-image.jpg",
        notes: "",
    });
    const [daySelected, setDaySelected] = useState(selectedDay || null);

    const handleLocationChange = async (newLocation) => {
        if (newLocation?.placePrediction?.structuredFormat?.mainText?.text) {
            const suggestion = await fetchPlaceDetails(newLocation.placePrediction.placeId)
            setNewActivity(prev => ({
                ...prev,
                placeId: suggestion.placeId,
                location: suggestion?.address ?? newLocation,
                coordinates: suggestion?.coordinates ?? [],
                rating: suggestion?.rating ?? "",
                openingHours: suggestion?.openingHours ?? "",
                website: suggestion?.website ?? "",
                link: suggestion?.link ?? "",
                image: suggestion?.image ?? "../src/assets/dummy-image.jpg"
            }));
        } else {
            setNewActivity(prev => ({
                ...prev,
                placeId: "",
                location: newLocation,
                coordinates: [],
                rating: "",
                openingHours: "",
                website: "",
                link: "",
                image: "../src/assets/dummy-image.jpg"
            }));
        }
    }

    const handleDurationChange = (e) => {
        const inputValue = e.target.value;

        // Allow empty input
        if (inputValue === '') {
            setNewActivity({ ...newActivity, duration: '' })
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
            setNewActivity({ ...newActivity, duration: inputValue });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {if (!open) {onClose()}
        }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[80vh] overflow-y-auto px-2 sm:px-0">
                    {/* Select Day */}
                    <div className="mb-3">
                        <label htmlFor="day-select" className="block text-sm font-medium text-muted-foreground mb-1">Day</label>
                        <Select
                            value={daySelected}
                            onValueChange={(value) =>
                                setDaySelected(value)
                            }
                        >
                            <SelectTrigger id="day-select" className="w-full min-h-[44px]">
                                <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                                {days.map((day, index) => (
                                    <SelectItem key={index} value={day.date} className="min-h-[44px]">
                                        {day.date}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Select Activity Type */}
                    <div className="mb-3">
                        <label htmlFor="activity-type" className="block text-sm font-medium text-muted-foreground mb-1">Activity Type</label>
                        <Select
                            value={newActivity.type}
                            onValueChange={(value) =>
                                setNewActivity((prev) => ({ ...prev, type: value }))
                            }
                        >
                            <SelectTrigger id="activity-type" className="w-full min-h-[44px]">
                                <SelectValue placeholder="Select activity type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="accommodation" className="min-h-[44px]">Accommodation</SelectItem>
                                <SelectItem value="outdoor" className="min-h-[44px]">Outdoor</SelectItem>
                                <SelectItem value="indoor" className="min-h-[44px]">Indoor</SelectItem>
                                <SelectItem value="food" className="min-h-[44px]">Food</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Select Time */}
                    <div className="mb-3">
                        <label htmlFor="activity-time" className="block text-sm font-medium text-muted-foreground mb-1">Time</label>
                        <Input
                            id="activity-time"
                            type="time"
                            value={newActivity.time}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, time: e.target.value }))
                            }
                            className="min-h-[44px]"
                        />
                    </div>

                    {/* Input Duration */}
                    <div className="mb-3">
                        <label htmlFor="activity-duration" className="block text-sm font-medium text-muted-foreground mb-1">Duration (in hours)</label>
                        <Input
                            id="activity-duration"
                            type="text"
                            placeholder="e.g. 0.5, 1, 1.5"
                            value={newActivity.duration}
                            onChange={handleDurationChange}
                            className="min-h-[44px]"
                        />
                    </div>

                    {/* Input Title */}
                    <div className="mb-3">
                        <label htmlFor="activity-name" className="block text-sm font-medium text-muted-foreground mb-1">Activity Name</label>
                        <Input
                            id="activity-name"
                            type="text"
                            placeholder="Enter activity name"
                            value={newActivity.title}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className="min-h-[44px]"
                        />
                    </div>

                    {/* Search address */}
                    <div className="mb-3">
                        <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                        <MapSearchBar
                            id="address"
                            onInputChange={handleLocationChange}
                            initialPlace={newActivity.location}
                        />
                    </div>

                    {/* Input Notes */}
                    <div className="mb-3">
                        <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                        <Textarea
                            id="notes"
                            className="w-full min-h-[80px] p-2 text-sm bg-white rounded-lg resize-none placeholder:text-muted-foreground/50"
                            placeholder="Add some notes..."
                            value={newActivity.notes}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, notes: e.target.value }))
                            }
                            style={{ minHeight: 44 }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                        {/* Cancel Button */}
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px]" aria-label="Cancel">
                            Cancel
                        </Button>

                        {/* Add Button */}
                        <Button
                            className="w-full sm:w-auto min-h-[44px]"
                            aria-label="Add Activity"
                            onClick={() => {
                                onAddActivity({
                                    ...newActivity,
                                    id: `${Date.now()}`,
                                }, daySelected);
                                onClose();
                            }}
                        >
                            Add Activity
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddActivityModal;

