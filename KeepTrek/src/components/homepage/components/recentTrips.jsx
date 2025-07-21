import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, DollarSign, MoreHorizontal } from "lucide-react";
import { getUserTrips } from "@/APIs/trip.js";
import GoogleMapImage from "@/components/MapboxMap/GoogleMapImage";
import { Skeleton } from "@/components/ui/skeleton";
import { getTripData } from "@/APIs/expenses";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function RecentTrips() {
  const [trips, setTrips] = useState([]);
  const [tripExpenses, setTripExpenses] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripsAndExpenses = async () => {
      try {
        setIsLoading(true);
        const userTrips = await getUserTrips();
        // Sort and take 4 most recent
        const recent = userTrips
          .slice()
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 4);
        setTrips(recent);
        // Fetch expenses for each trip
        const expensesArr = await Promise.all(
          recent.map(async (trip) => {
            try {
              const data = await getTripData(trip.tripID);
              return { tripID: trip.tripID, userExpense: data.user_expense };
            } catch {
              return { tripID: trip.tripID, userExpense: null };
            }
          })
        );
        const expensesObj = {};
        expensesArr.forEach(({ tripID, userExpense }) => {
          expensesObj[tripID] = userExpense;
        });
        setTripExpenses(expensesObj);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch trips.");
        setIsLoading(false);
      }
    };
    fetchTripsAndExpenses();
  }, [user]);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RecentTripsLoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (trips.length === 0) {
    return <div className="text-gray-500 text-center py-8">No recent trips found.</div>;
  }

  const handleNewImage = (tripID, newImage) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.tripID === tripID ? { ...trip, image: newImage } : trip
      )
    );
  };

  const handleViewTrip = (tripID) => {
    navigate(`/itinerary/${tripID}`);
  };

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
          <button 
          className="border border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent px-4 py-2 rounded-md font-medium transition-colors"
          onClick={() => navigate('/yourTrips')}>
            View All Trips
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.tripID}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.5, delay: index * 0.1 }}
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
                <div className="absolute inset-0 "></div>
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
                      {tripExpenses[trip.tripID] !== undefined && tripExpenses[trip.tripID] !== null
                        ? `RM${Number(tripExpenses[trip.tripID]).toFixed(2)}`
                        : "-"}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white py-2 px-4 rounded-md font-medium transition-all"
                  onClick={() => handleViewTrip(trip.tripID)}
                >
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
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-gray-200" />
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-6 w-24 rounded-full bg-gray-200" />
            </div>
            <div className="h-7 w-3/4 mb-4 bg-gray-200 rounded" />
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
