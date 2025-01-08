import React, { useEffect, useState } from "react";
import TopNavbar from "../topNavBar/TopNavbar.jsx";
import TripsList from "./tripList.jsx";
import ErrorMessage from "./erroeMessage.jsx";
import NoTripsMessage from "./noTripsMessage.jsx";
import { getUserTrips } from "@/APIs/trip.js"; // API function to fetch trips
import JoinButton from "../Invite/JoinButton.jsx";

export default function YourTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userTrips = await getUserTrips();
        setTrips(userTrips);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch trips.");
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between">
          <h1 className="text-5xl font-bold text-center mb-6">Your Trips</h1>
          <JoinButton />
          </div>
          {error ? <ErrorMessage error={error} /> : null}
          {trips.length > 0 ? (
            <TripsList trips={trips} />
          ) : (
            !error && <NoTripsMessage />
          )}
        </div>
      </div>
    </div>
  );
}