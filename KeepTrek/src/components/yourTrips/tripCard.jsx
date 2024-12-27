import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";

export default function TripCard({ trip }) {
  return (
    <NavLink to={`/itineraryWL/${trip.tripID}`} className="no-underline">
      <Card className="border border-gray-200 bg-white shadow hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            {trip.tripName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {new Date(trip.startDate).toLocaleDateString()} -{" "}
            {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </NavLink>
  );
}