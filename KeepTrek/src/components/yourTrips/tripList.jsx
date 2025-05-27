import React from "react";
import TripCard from "./tripCard";
import { motion, AnimatePresence } from "framer-motion";

export default function TripsList({ trips, sort}) {

  const sortedTrips = sort
    ? trips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) : 
    trips.sort((a, b) => {
      if (a.tripName.toLowerCase() < b.tripName.toLowerCase()) return -1;
      if (a.tripName.toLowerCase() > b.tripName.toLowerCase()) return 1;
      return 0;
    });


  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {sortedTrips.map((trip) => (
          <motion.div key={trip.tripID} layout>
            <TripCard trip={trip} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
