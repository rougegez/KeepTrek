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

export default function CreateTrip() {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!tripName || !location || !dateRange.from || !dateRange.to) {
      setError("All fields are required.");
      return;
    }

    // Prepare data for the API
    const startDate = new Date(dateRange.from).toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const endDate = new Date(dateRange.to).toISOString().split("T")[0];

    try {
      await createTrip({ tripName, location, startDate, endDate });
      alert("Trip created successfully!");
      navigate("/trip-details"); // Redirect to homepage or trips page
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.response?.data?.detail || "Failed to create trip");
    }
  };

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
                <Input
                  id="location"
                  placeholder="Enter trip location"
                  className="w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Trip Dates */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trip Dates
                </label>
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
              >
                Create Trip
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}