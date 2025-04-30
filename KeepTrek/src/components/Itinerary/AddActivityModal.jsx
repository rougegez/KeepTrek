import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar";
import { Textarea } from '@/components/ui/textarea';
import { fetchPlaceDetails } from "@/APIs/fetchPlaceDetails.js";

const AddActivityModal = ({ isOpen, onClose, onAddActivity, location, days, selectedDay }) => {
    const [newActivity, setNewActivity] = useState({
        day: "",
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

    useEffect(() => {
        setNewActivity(prev => ({
            ...prev,
            day: selectedDay ?? "",
            title: location ? location.name : "",
            placeId: location ? location.placeId : "",
            location: location ? location.address : "",
            coordinates: location ? location.coordinates : [],
            rating: location ? location.rating : "",
            image: location ? location.image : "../src/assets/dummy-image.jpg",
            openingHours: location ? location.openingHours : "",
            website: location ? location.website : "",
            link: location ? location.link : "",
        }));
    }, [isOpen, location, selectedDay]);

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
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setNewActivity({
                    day: "",
                    type: "",
                    time: "",
                    duration: "",
                    title: "",
                    location: "",
                    image: "../src/assets/dummy-image.jpg",
                    notes: "",
                });
                onClose();
            }
        }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Select Day */}
                    <div>
                        <label htmlFor="day-select" className="block text-sm font-medium text-muted-foreground mb-1">Day</label>
                        <Select
                            value={newActivity.day}
                            onValueChange={(value) =>
                                setNewActivity((prev) => ({ ...prev, day: value }))
                            }
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

                    {/* Select Activity Type */}
                    <div>
                        <label htmlFor="activity-type" className="block text-sm font-medium text-muted-foreground mb-1">Activity Type</label>
                        <Select
                            value={newActivity.type}
                            onValueChange={(value) =>
                                setNewActivity((prev) => ({ ...prev, type: value }))
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
                            value={newActivity.time}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, time: e.target.value }))
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
                            value={newActivity.duration}
                            onChange={handleDurationChange}
                        />
                    </div>

                    {/* Input Title */}
                    <div>
                        <label htmlFor="activity-name" className="block text-sm font-medium text-muted-foreground mb-1">Activity Name</label>
                        <Input
                            id="activity-name"
                            type="text"
                            placeholder="Enter activity name"
                            value={newActivity.title}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, title: e.target.value }))
                            }
                        />
                    </div>

                    {/* Search address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                        <MapSearchBar
                            id="address"
                            searchButton={false}
                            onChange={handleLocationChange}
                            initialPlace={newActivity.location}
                        />
                    </div>

                    {/* Input Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                        <Textarea
                            id="notes"
                            className="w-full min-h-[80px] p-2 text-sm bg-white rounded-lg resize-none placeholder:text-muted-foreground/50"
                            placeholder="Add some notes..."
                            value={newActivity.notes}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, notes: e.target.value }))
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        {/* Cancel Button */}
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        {/* Add Button */}
                        <Button
                            onClick={() => {
                                onAddActivity({
                                    ...newActivity,
                                    id: `${Date.now()}`,
                                });
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

