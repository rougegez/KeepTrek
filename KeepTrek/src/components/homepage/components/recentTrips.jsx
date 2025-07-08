import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, DollarSign, MoreHorizontal } from "lucide-react";
import { getUserTrips } from "@/APIs/trip.js";
import GoogleMapImage from "@/components/MapboxMap/GoogleMapImage";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const userTrips = await getUserTrips();
        setTrips(userTrips);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch trips.");
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Sort by startDate descending and take the 4 most recent
  const recentTrips = trips
    .slice()
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 4);

  if (isLoading) {
    return <RecentTripsLoadingSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (recentTrips.length === 0) {
    return <div className="text-gray-500 text-center py-8">No recent trips found.</div>;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800"
          >
            Your Recent Trips
          </motion.h2>
          <button className="border border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent px-4 py-2 rounded-md font-medium transition-colors">
            View All Trips
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentTrips.map((trip, index) => (
            <motion.div
              key={trip.tripID}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <GoogleMapImage
                  placeId={trip.placeId}
                  src={trip.image}
                  alt="/assets/dummy-image.jpg"
                  className="object-cover w-full h-full absolute inset-0"
                  onNewImage={(newImage) => handleNewImage(trip.tripID, newImage)}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-purple-500 opacity-60"></div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 text-white hover:bg-white/20 rounded transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{trip.tripName}</h3>
                  <div className="flex items-center text-sm opacity-90">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.location}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formatTripStatus(trip)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {trip.users?.length || 1} members
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {trip.budget ? `RM${trip.budget}` : "-"}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white py-2 px-4 rounded-md font-medium transition-all">
                  {formatTripStatus(trip) === "Completed" ? "View Trip" : "Continue Planning"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
}

function formatTripStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return "Planning";
  if (now <= end) return "Active";
  return "Completed";
}

const RecentTripsLoadingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-slate-100 rounded-lg shadow overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-7 w-3/4 mb-4" />
            <div className="flex items-center space-x-2 mb-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
