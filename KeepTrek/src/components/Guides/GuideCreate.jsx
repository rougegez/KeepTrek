import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react"
import TopNavbar from "@/components/topNavBar/TopNavbar"
import { useNavigate } from "react-router-dom"
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar.jsx";
import { fetchPlaceDetails } from "@/APIs/fetchPlaceDetails.js";
import { useState } from "react";
import InfoTip from "../Tooltip/InfoTip.jsx"
import { toast } from "sonner";
import { createGuide } from "@/APIs/guides.js";
import toastPromise from "@/utils/toastPromise.js"

export default function GuideCreate() {

    const navigate = useNavigate()
    const [location, setLocation] = useState({ location: "", placeId: "", coordinates: [], image: "../src/assets/dummy-image.jpg", viewport: {} });
    const [guideName, setGuideName] = useState("");
    const [duration, setDuration] = useState({ days: "", nights: "" });

    const handleLocationChange = async (loc) => {
        if (loc?.placePrediction?.structuredFormat?.mainText?.text) {
            const suggestion = await fetchPlaceDetails(loc.placePrediction.placeId);
            setLocation({
                location: loc.placePrediction.structuredFormat.mainText.text,
                placeId: suggestion.placeId,
                coordinates: [suggestion.coordinates[0], suggestion.coordinates[1]],
                image: suggestion.image,
                viewport: suggestion.viewport
            });
        } else {
            setLocation({
                location: loc,
                placeId: "",
                coordinates: [],
                image: "../src/assets/dummy-image.jpg",
                viewport: {}
            });
        }
    }

    const handleSubmit = async () => {
        // Validate input
                const guideData = {
            title: guideName,
            location: location.location,
            placeId: location.placeId,
            coordinates: location.coordinates,
            hero_image : location.image,
            duration: duration,
            viewport: location.viewport
        };
        console.log("Guide Data:", guideData);
        if (!guideName || !location.location || !duration.days || !duration.nights) {
            toast.error("All fields are required.");
            return;
        }
        try {
            const response = await toastPromise(
                createGuide(guideData), {
                loading: "Creating guide...",
                success: {
                    message: "Guide created successfully!",
                    action: {
                        label: "View Guide",
                        onClick: () => navigate(`/guides/edit/${response.data.id}`)
                    }
                },
                error: (error) => {
                    return {
                        message: "Failed to create guide",
                        description: error?.message || "An unexpected error occurred"
                    }
                }
            }
            )
        } catch (error) {
            console.error("Failed to create guide:", error);
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <TopNavbar />
            <div
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-4">
                    <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => navigate("/guides")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Travel Guides
                    </Button>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Guide</h1>
                    <p className="text-gray-600">Share your travel experience with the community</p>
                </div>

                {/* Create Guide Form */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900">Guide Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">
                                Guide Title <span className="text-red-500">*</span>
                            </Label>
                            <Input id="title" onChange={(e) => setGuideName(e.target.value)} placeholder="e.g., The Ultimate Tokyo Food Adventure" className="w-full" />
                            <p className="text-xs text-gray-500">Give your guide a catchy and descriptive title</p>
                        </div>

                        {/* Location Field */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="location" className="text-sm font-medium">
                                    Location <span className="text-red-500">*</span>
                                </Label>
                                <InfoTip tooltipProps={{ root: { defaultOpen: true } }}>
                                    We recommend that you use a location from the searchbar instead of a custom name
                                </InfoTip>
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <MapSearchBar
                                    id="location"
                                    searchButton={false}
                                    onInputChange={handleLocationChange}
                                />
                            </div>
                            <p className="text-xs text-gray-500">Enter the main destination for your guide</p>
                        </div>

                        {/* Duration Fields */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Duration <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="days" className="text-xs text-gray-600">
                                        Days
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="days" onChange={(e) => setDuration(prev => ({ ...prev, days: Number(e.target.value) }))} type="number" min="1" placeholder="4" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nights" className="text-xs text-gray-600">
                                        Nights
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="nights" onChange={(e) => setDuration(prev => ({ ...prev, nights: Number(e.target.value) }))} type="number" min="0" placeholder="3" className="pl-10" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">How long is your recommended trip duration?</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                            <Button
                                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                                onClick={handleSubmit}>Create Guide</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h3 className="text-sm font-medium text-teal-800 mb-2">What happens next?</h3>
                    <ul className="text-sm text-teal-700 space-y-1">
                        <li>• After creating your guide, you'll be able to add detailed itinerary items</li>
                        <li>• Upload photos and add descriptions for each location</li>
                        <li>• Your guide will be visible to the KeepTrek community once published</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}