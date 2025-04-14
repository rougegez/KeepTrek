import React, { useState, lazy, Suspense } from "react";
import { MapPin, Calendar, Clock, Users, Share2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserAvatarStack } from "@/components/profilePage/avatar.jsx";
import ShareModal2 from "./ShareModal2.jsx"; 

// lazy‐load the nested modal

export default function ShareModal({
  trip,
}) {

  const handleShare = () => {
  };

  const days = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="!text-center">
          <DialogTitle className="text-2xl font-bold">
            Share your experience to the World!
          </DialogTitle>
          <DialogDescription>
            You have recently completed <b>{trip.tripName}</b> on <b>{trip.endDate}</b>.<br />
            Had a great time? Why not share your experience and inspire others!
          </DialogDescription>
        </DialogHeader>

        {/* Trip Card*/}
        <Card className="overflow-hidden relative group">
          <div className="relative h-48">
            <img
              src={trip.image}
              alt={trip.tripName}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <h3 className="text-2xl font-semibold">{trip.tripName}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{trip.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-md text-gray-500 mb-2 justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-gray-400 text-right">
                  {days} days
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserAvatarStack
                userIds={trip.users}
                size={6}
                maxUsers={5}
                className="-space-x-2"
              />
              <span>{trip.users.length} participants</span>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <ShareModal2 trip={trip}/>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
