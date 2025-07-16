import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditableText from "@/components/ui/EditableText";
import EditableRichText from "@/components/ui/EditableRichText";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapSearchBar from "@/components/MapboxMap/GoogleMapsSearchbar.jsx";
import { fetchPlaceDetails } from "@/APIs/fetchPlaceDetails";
import { Label } from "@/components/ui/label";

const emptyActivity = {
    id: "",
    time: null,
    duration: null,
    title: null,
    placeId: null,
    location: null,
    coordinates: [],
    image: null,
    rating: null,
    website: null,
    openingHours: null,
    link: null,
    description: null,
};

function GuideAddActivityModal({ open, onOpenChange, onAddActivity, selectedDay, location, locationBias }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [googleLocation, setGoogleLocation] = useState({
        placeId: location?.placeId || "",
        location: location?.location || "",
        coordinates: location?.coordinates || [],
        image: location?.image || [],
        viewport: location?.viewport || null,
        rating: location?.rating || "",
        openingHours: location?.openingHours || "",
        website: location?.website || "",
        link: location?.link || "",
    });


    const handleSave = () => {
        const newActivity = {
            ...emptyActivity,
            id: `${Date.now()}`,
            title: title || "",
            description: description || "",
            time: time || "",
            duration: duration || "",
            ...googleLocation,
        };
        onAddActivity(newActivity, selectedDay);
    };

    const handleLocationChange = async (newLocation) => {
        if (newLocation?.placePrediction?.structuredFormat?.mainText?.text) {
            const suggestion = await fetchPlaceDetails(newLocation.placePrediction.placeId)
            setGoogleLocation((prev) => {
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
                    image: suggestion?.image ? [suggestion?.image] : []
                }
            });
        } else {
            setGoogleLocation((prev) => {
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
                    image: [],
                }
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
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
                        <Label htmlFor="activity-duration" className="block text-sm font-medium text-muted-foreground mb-1">Duration (in hours)</Label>
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
                            locationBias={locationBias}
                        />
                    </div>


                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                        <Button onClick={handleSave} className="w-full sm:w-auto">Add</Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default GuideAddActivityModal;
