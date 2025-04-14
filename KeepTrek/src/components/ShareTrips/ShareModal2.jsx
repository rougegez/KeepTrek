// src/components/ShareTrips/ShareModal2.jsx
import React, { useState } from "react";
import { X, Clock, MapPin, Upload, Share2, CalendarIcon, Pencil } from "lucide-react";
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
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "../ui/file-uploader";
import { UserAvatarStack } from "@/components/profilePage/avatar.jsx";

export default function ShareModal2(
  { trip,
  }) {

  const handleShare = () => {
    console.log("Shared!");
  };

  const handleFileUpload = (files) => {
    console.log("Files uploaded:", files);
  }

  const days = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog>
      <DialogTrigger asChlid>
        <Button className="w-full">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">Share {trip.tripName}?</DialogTitle>
          <DialogDescription>
            Edit the trip image or add a description
          </DialogDescription>
        </DialogHeader>

        <Card className="overflow-hidden relative group">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative w-full h-48 m-0 p-0 hover:bg-slate-50">
                <img
                  src={trip.image}
                  alt={trip.tripName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                  <Pencil className="h-6 w-6 text-white" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Upload New Banner</h4>
                <FileUploader
                  className="w-full"
                  onValueChange={(files) => handleFileChange(files)}
                />
              </div>
            </PopoverContent>
          </Popover>
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
        {/* body */}
        <Textarea
          placeholder="Description..."
          className="w-full mb-6 resize-none text-gray-500"
          rows={3}
        />

        {/* footer */}
        <DialogFooter>
          <Button onClick={handleShare} className="w-full">
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
