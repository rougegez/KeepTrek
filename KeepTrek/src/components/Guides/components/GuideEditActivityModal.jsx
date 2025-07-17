import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EditableText from "@/components/ui/EditableText";
import EditableRichText from "@/components/ui/EditableRichText";
import MapSearchBar from "@/components/MapboxMap/GoogleMapsSearchbar.jsx";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchPlaceDetails } from "@/APIs/fetchPlaceDetails";
import InfoTip from "@/components/Tooltip/InfoTip";
import { Label } from "@/components/ui/label";

function GuideEditActivityModal({ open, onOpenChange, activity, onSave, locationBias }) {
    const [title, setTitle] = useState(activity.title || "");
    const [description, setDescription] = useState(activity.description || "");
    const [image, setImage] = useState(activity.image || []);
    const [time, setTime] = useState(activity.time || "");
    const [duration, setDuration] = useState(activity.duration || "");
    const [location, setLocation] = useState({ location: activity.location || "" });

    const handleSave = () => {
        const updatedActivity = {
            ...activity,
            title: title || null,
            description: description || null,
            image: image && image.length > 0 ? image : null,
            time: time || null,
            duration: duration.endsWith(".") ? duration.slice(0, duration.length - 1) : duration || null,
            placeId: activity.placeId || null,
            location: activity.location || null,
            coordinates: activity.coordinates || [],
            rating: activity.rating || null,
            website: activity.website || null,
            openingHours: activity.openingHours || null,
            link: activity.link || null,
            ...location
        };
        onSave(updatedActivity);
    };

    const handleLocationChange = async (newLocation) => {
        if (newLocation?.placePrediction?.structuredFormat?.mainText?.text) {
            const suggestion = await fetchPlaceDetails(newLocation.placePrediction.placeId)
            setLocation((prev) => {
                return {
                    ...prev,
                    placeId: suggestion?.placeId ?? "",
                    location: suggestion?.location ?? "",
                    coordinates: suggestion?.coordinates ?? [],
                    viewport: suggestion?.viewport ?? null,
                    rating: suggestion?.rating ?? "",
                    openingHours: suggestion?.openingHours ?? "",
                    website: suggestion?.website ?? "",
                    link: suggestion?.link ?? "",
                    image: Array.isArray(activity.image) && suggestion?.image ? [...activity.image, suggestion?.image] : activity.image
                }
            });
        } else {
            setLocation((prev) => {
                return {
                    ...prev,
                    placeId: "",
                    location: newLocation,
                    coordinates: [],
                    viewport: null,
                    rating: "",
                    openingHours: "",
                    website: "",
                    link: "",
                    image: activity.image,
                }
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[80vh] overflow-y-auto px-2 sm:px-0">
                    {/* Title */}
                    <div className="mb-3">
                        <Label htmlFor="activity-name" className="block text-sm font-medium text-muted-foreground mb-1">Activity Name</Label>
                        <EditableText
                            initialValue={title}
                            placeholder="Activity Title"
                            onSave={setTitle}
                            className="mb-2"
                        />
                    </div>
                    {/* Description */}
                    <div className="mb-3">
                        <Label htmlFor="activity-description" className="block text-sm font-medium text-muted-foreground mb-1">Description</Label>
                        <EditableRichText
                            initialContent={description}
                            onSave={setDescription}
                            placeholder="Description"
                            className="mb-2"
                        />
                    </div>
                    {/* Time */}
                    <div className="mb-3">
                        <Label htmlFor="activity-time" className="block text-sm font-medium text-muted-foreground mb-1">Time</Label>
                        <Input
                            id="activity-time"
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                        />
                    </div>
                    {/* Duration */}
                    <div className="mb-3">
                        <div className="flex ">
                            <Label htmlFor="activity-duration" className="block text-sm font-medium text-muted-foreground mb-1">Duration (in hours)</Label>
                            <InfoTip
                                tooltipProps={{
                                    root : { defaultOpen: true },
                                }}>
                                In increments of 0.5 and max 24 hours
                            </InfoTip>
                        </div>
                        <Input
                            id="activity-duration"
                            type="text"
                            placeholder="e.g. 0.5, 1, 1.5"
                            value={duration}
                            onChange={e => {
                                if (/^\d{1,2}\.?5?$|^$/.test(e.target.value) && e.target.value <= 24) {
                                    setDuration(e.target.value)
                                } else if (e.target.value > 24) setDuration("24")
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Location</Label>
                        <MapSearchBar
                            id="address"
                            searchButton={false}
                            onInputChange={handleLocationChange}
                            initialPlace={activity.location}
                            locationBias={locationBias}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                        <Button onClick={handleSave} className="w-full sm:w-auto">Save</Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default GuideEditActivityModal;
