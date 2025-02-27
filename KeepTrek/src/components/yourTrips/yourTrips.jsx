import React, { useEffect, useState } from "react";
import TopNavbar from "../topNavBar/TopNavbar.jsx";
import TripsList from "./tripList.jsx";
import ErrorMessage from "./erroeMessage.jsx";
import NoTripsMessage from "./noTripsMessage.jsx";
import { getUserTrips } from "@/APIs/trip.js"; // API function to fetch trips
import JoinButton from "../Invite/JoinButton.jsx";
import { Skeleton } from "@/components/ui/skeleton"
import { useQueryClient } from "react-query";

const YourTripsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="bg-slate-100 rounded-lg shadow overflow-hidden">
          {/* Image placeholder */}
          <Skeleton className="w-full h-48" />
          
          <div className="p-6">
            {/* Status badge placeholder */}
            <div className="flex justify-end mb-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Title placeholder */}
            <Skeleton className="h-7 w-3/4 mb-4" />

            {/* Date range placeholder */}
            <div className="flex items-center space-x-2 mb-3">
              <Skeleton className="h-4 w-4" /> {/* Calendar icon */}
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Participants placeholder */}
            <div className="flex items-center space-x-2 mb-4">
              <Skeleton className="h-4 w-4" /> {/* Person icon */}
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Created by placeholder */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default function YourTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  

  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const userTrips = await getUserTrips();
        
        if (isMounted) {
          setTrips(userTrips);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.detail || "Failed to fetch trips.");
          setIsLoading(false);
        }
      }
    };

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTripDelete = (tripId) => {
    // Optimistically remove the trip from UI
    setTrips(prev => prev.filter(trip => trip.tripID !== tripId));
    
    // Invalidate trips query to refresh data
    queryClient.invalidateQueries('trips');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between">
          <h1 className="text-5xl font-bold text-center mb-6">Your Trips</h1>
          <JoinButton />
          </div>
          {error ? (
            <ErrorMessage error={error} />
          ) : isLoading ? (
            <YourTripsLoadingSkeleton />
          ) : trips.length > 0 ? (
            <TripsList trips={trips} />
          ) : (
            <NoTripsMessage />
          )}
        </div>
      </div>
    </div>
  );
}
