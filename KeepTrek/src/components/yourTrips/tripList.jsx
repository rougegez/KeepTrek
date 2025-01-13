import React from "react";
import TripCard from "./tripCard";

export default function TripsList({ trips }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.tripID} trip={trip} />
      ))}
    </div>
  );
}
