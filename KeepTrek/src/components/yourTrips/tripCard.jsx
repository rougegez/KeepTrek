// src/components/TripCard.jsx
import React, { useState, useEffect, memo } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { CalendarIcon, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/APIs/users";
import { UserAvatar, UserAvatarStack } from "../profilePage/avatar";
import { UserRole } from "@/utils/permissions";
import { MoreVertical, ExternalLink, Pencil, Trash2, LogOut, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeaveAlert from "@/components/ui/LeaveAlert";
import DeleteAlert from "@/components/ui/DeleteAlert";
import { useNavigate } from "react-router-dom";
import { removeMember, deleteTrip, editTrip } from "@/APIs/trip.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthProvider";
import ShareModal from "@/components/ShareTrips/ShareModal";
import GoogleMapImage from "@/components/MapboxMap/GoogleMapImage";
import { createDraftGuide } from "@/APIs/guides";
import toastPromise from "@/utils/toastPromise";

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // permissions
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  // creator profile
  const [creator, setCreator] = useState(null);
  const [isLoadingCreator, setIsLoadingCreator] = useState(true);

  // UI state
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newTripName, setNewTripName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  // determine roles
  useEffect(() => {
    const roleObj = trip.users.find((u) => u.userID === currentUser);
    const role = roleObj?.role;
    setIsAdmin(role === UserRole.ADMIN);

    const creatorId = typeof trip.creatorID === "object"
      ? trip.creatorID.userID
      : trip.creatorID;
    setIsCreator(currentUser === creatorId);
  }, [trip.users, trip.creatorID, currentUser]);

  // fetch creator profile
  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile(trip.creatorID.userID || trip.creatorID);
        setCreator(profile);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingCreator(false);
      }
    })();
  }, [trip.creatorID]);

  // trip status
  const getTripStatus = () => {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (now < start) return "upcoming";
    if (now <= end) return "ongoing";
    return "completed";
  };

  const status = getTripStatus();

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    ongoing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  // handlers
  const openInNewTab = () => window.open(`/itinerary/${trip.tripID}`, "_blank");

  const handleLeave = async () => {
    await removeMember(trip.tripID, currentUser);
    window.location.reload();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTrip(trip.tripID);
    onDelete?.(trip.tripID);
    window.location.reload();
  };

  const openRenameDialog = () => {
    setNewTripName(trip.tripName);
    setRenameError("");
    setShowRenameDialog(true);
  };

  const handleRename = async () => {
    if (!newTripName.trim()) {
      setRenameError("Trip name cannot be empty");
      return;
    }
    setIsRenaming(true);
    try {
      await editTrip(trip.tripID, {
        tripName: newTripName,
        location: trip.location,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        image: trip.image,
      });
      setShowRenameDialog(false);
      window.location.reload();
    } catch (e) {
      setRenameError(e.message || "Failed to rename trip");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    document.getElementById(`trip-menu-${trip.tripID}`)?.click();
  };

  const handleNewImage = async (image) => {
    if (isCreator) {
      try {
        await editTrip(trip.tripID,
          {
            image: image
          });
      } catch (e) {
        console.error(e);
      }
    }
  }

  const handleCreateGuide = async () => {
    try {
      const response = await toastPromise(
        createDraftGuide(trip.tripID), {
        loading: "Creating guide...",
        success: { 
          message: "Guide created successfully!", 
          action: { 
            label: "View Guide", 
            onClick: () => navigate(`/guides/view/${response.data.id}`)
          }
        },
        error: (error) => {
          return {
            message: "Failed to create guide",
            description: error?.message || "An unexpected error occurred"
          }
        }
      }
      )
    } catch (error) {
      console.error("Failed to create guide:", error);
    }
  }

  // calculate days
  const days =
    Math.ceil(
      (new Date(trip.endDate) - new Date(trip.startDate)) /
      (1000 * 60 * 60 * 24)
    ) || 1;

  // Helper to format date as DD/MM/YYYY
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="overflow-hidden hover:bg-[#f8fffd] relative group">
          {/* clickable area */}
          <NavLink
            to={`/itinerary/${trip.tripID}`}
            className="no-underline block"
            onContextMenu={handleContextMenu}
          >
            <div className="relative h-48">
              <GoogleMapImage
                placeId={trip?.placeId}
                src={trip.image}
                alt={trip.tripName}
                className="w-full h-full object-cover"
                onNewImage={handleNewImage}
              />
              <Badge className={`absolute top-2 right-2 ${statusColors[status]}`}>
                {statusLabel}
              </Badge>
            </div>
            <CardHeader>
              <h3 className="text-2xl font-semibold">{trip.tripName}</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
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
          </NavLink>

          {/* controls outside the link */}
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <UserAvatar userId={creator?.id} className="h-6 w-6" />
                <span className="text-sm text-gray-500">
                  {isLoadingCreator
                    ? "Loading..."
                    : `Created by ${creator?.username || "Unknown"}`}
                </span>
              </div>
              <div className="flex items-center gap-1">

                {/* <ShareModal trip={trip} /> */}

                {currentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id={`trip-menu-${trip.tripID}`}
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          openInNewTab();
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuItem
                            onClick={handleCreateGuide}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Create Guide
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              openRenameDialog();
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 font-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowDeleteAlert(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                      {!isCreator && currentUser && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 font-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowLeaveAlert(true);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Leave trip
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <LeaveAlert
        isOpen={showLeaveAlert}
        onClose={() => setShowLeaveAlert(false)}
        onConfirm={handleLeave}
      />
      <DeleteAlert
        isOpen={showDeleteAlert}
        onClose={() => !isDeleting && setShowDeleteAlert(false)}
        onConfirm={handleDelete}
        itemName="Trip"
        itemType="trip"
        isLoading={isDeleting}
      />

      {/* Rename Dialog */}
      <Dialog
        open={showRenameDialog}
        onOpenChange={(open) => !isRenaming && setShowRenameDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Trip</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="tripName" className="block text-sm font-medium">
                Trip Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="tripName"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Enter new name for your trip"
                className="col-span-3"
              />
              {renameError && (
                <p className="text-sm text-red-500">{renameError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={isRenaming}>
              {isRenaming ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {isRenaming ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
