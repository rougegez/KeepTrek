import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { CalendarIcon, Users2Icon } from 'lucide-react'
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { getUserProfile } from "@/APIs/users";
import { useState, useEffect } from "react";


export default function TripCard({ trip }) {
  const getTripStatus = () => {
    const currentDate = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (currentDate < startDate) {
      return "upcoming";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "ongoing";
    } else {
      return "completed";
    }
  };

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    ongoing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  const status = getTripStatus();

  const [creator, setCreator] = useState(null);
  const [isLoadingCreator, setIsLoadingCreator] = useState(true);
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const userProfile = await getUserProfile(trip.creatorID);
        setCreator(userProfile);
      } catch (error) {
        console.error('Error fetching creator:', error);
      } finally {
        setIsLoadingCreator(false);
      }
    };

    fetchCreator();
  }, [trip.creatorID]);
  return (
    <NavLink to={`/itinerary/${trip.tripID}`} className="no-underline">
      <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden hover:bg-[#f8fffd]">
        <div className="relative h-48">
          <img
            src={trip.image}
            alt={trip.tripName}
            className="w-full h-full object-cover"
          />
          <Badge 
            className={`absolute top-2 right-2 ${statusColors[status]}`}
            
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <CardHeader>
          <h3 className="text-2xl font-semibold">{trip.tripName}</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users2Icon className="w-4 h-4" />
            <span>{trip.users.length} participants</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex -space-x-2 overflow-hidden">
          <span className="text-sm text-gray-500">
                {isLoadingCreator ? 'Loading...' : `Created by ${creator?.username || 'Unknown'}`}
              </span>
          </div>
          </CardFooter>
        
      </Card>
    </motion.div>
    </NavLink>
  );
}