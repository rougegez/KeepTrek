import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MapSearchBar from "../MapboxMap/MapSearchbarGeoAPIV5";

const AddActivityModal = ({ isOpen, onClose, onAddActivity, mapInstance, location, days, selectedDay }) => {
    const [newActivity, setNewActivity] = useState({
        day: "",
        type: "food",
        title: "",
        location: "",
        notes: "",
    });

    useEffect(() => {
        if (isOpen) {
            setNewActivity(prev => ({
                ...prev,
                day: selectedDay || "",
                location: location ? location.address : ""
            }));
        } else {
            setNewActivity({
                day: "",
                type: "food",
                title: "",
                location: "",
                notes: "",
            });
        }
    }, [isOpen, location, selectedDay]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setNewActivity({
                    day: "",
                    type: "food",
                    title: "",
                    location: "",
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

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                        <MapSearchBar
                            id="address"
                            searchButton={false}
                            onChange={(value) => {
                                setNewActivity((prev) => ({ ...prev, location: value}
                                ))}}
                            initialPlace={newActivity.location}
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                        <textarea
                            id="notes"
                            className="w-full min-h-[80px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
                            placeholder="Add some notes..."
                            value={newActivity.notes}
                            onChange={(e) =>
                                setNewActivity((prev) => ({ ...prev, notes: e.target.value }))
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                onAddActivity({
                                    ...newActivity,
                                    id: `${Date.now()}`,
                                    time: "8:00am",
                                    duration: "1 hr",
                                    image: "./src/assets/dummy-image.jpg",
                                    location: newActivity.location,
                                });
                                setNewActivity({ day: "", type: "food", title: "", location: "", notes: "" });
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

