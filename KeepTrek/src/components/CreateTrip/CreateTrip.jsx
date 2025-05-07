import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/datepicker.jsx";
import { Input } from "@/components/ui/input";
import TopNavbar from "../topNavBar/TopNavbar.jsx";
import { createTrip } from "@/APIs/trip.js";
import { useNavigate } from "react-router-dom";
import { createItinerary } from "@/APIs/itinerary.js";
import MapSearchBar from "../MapboxMap/GoogleMapsSearchbar.jsx";
import { fetchPlaceDetails } from "@/APIs/fetchPlaceDetails.js";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/loading-spinner.jsx";
import InfoTip from "@/components/Tooltip/InfoTip.jsx";

export default function CreateTrip() {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("../src/assets/dummy-image.jpg");
  const [coordinates, setCoordinates] = useState([]);
  const [error, setError] = useState(null);
  const [placeId, setPlaceId] = useState("");
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!tripName || !location || !dateRange.from || !dateRange.to) {
      setError("All fields are required.");
      return;
    }

    setIsCreating(true);

    // Prepare data for the API
    const startDate = new Date(dateRange.from).toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const endDate = new Date(dateRange.to).toISOString().split("T")[0];

    try {
      const response = await createTrip({ tripName, placeId, location, coordinates, startDate, endDate, image });
      const tripID = response.tripID;
      // Create itinerary
      const dayCount = Math.ceil((new Date(dateRange.to) - new Date(dateRange.from)) / (1000 * 60 * 60 * 24)) + 1;
      const days = Array.from({ length: dayCount }, (_, i) => ({
        date: `Day ${i + 1}`,
        activities: []
      }));
      await createItinerary({ tripID, days });
      toast.success("Trip created successfully!");
      navigate("/yourTrips"); // Redirect to homepage or trips page
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.response?.data?.detail || "Failed to create trip");
    }
    setIsCreating(false);
  }

  const handleLocationChange = async (location) => {
    if (location?.placePrediction?.structuredFormat?.mainText?.text) {
      setLocation(location.placePrediction.structuredFormat.mainText.text);
      const suggestion = await fetchPlaceDetails(location.placePrediction.placeId);
      setPlaceId(suggestion.placeId);
      setCoordinates([suggestion.coordinates[0], suggestion.coordinates[1]]);
      setImage(suggestion.image);
    } else {
      setLocation(location);
      setImage("../src/assets/dummy-image.jpg");
      setPlaceId("");
      setCoordinates([]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">Create Your Trip</CardTitle>
            <CardDescription>Plan your next adventure!</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Trip Name */}
              <div className="space-y-2">
                <label
                  htmlFor="tripName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Trip Name
                </label>
                <Input
                  id="tripName"
                  placeholder="Enter trip name"
                  className="w-full"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <MapSearchBar
                  id="location"
                  searchButton={false}
                  onChange={handleLocationChange}
                />
              </div>

              {/* Trip Dates */}
              <div className="space-y-2">
                <div className="flex">
                  <label className="text-sm font-medium text-gray-700">
                    Trip Dates
                  </label>
                  <InfoTip tooltipProps={{ root: { defaultOpen: true } }}>
                    Select a range of dates
                  </InfoTip>
                </div>
                <DateRangePicker
                  value={dateRange}
                  onValueChange={setDateRange}
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                className="w-full bg-[#4DB6AC] hover:bg-[#37827a] text-white"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? <LoadingSpinner className="mr-2 h-4 w-4" /> : "Create Trip"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}