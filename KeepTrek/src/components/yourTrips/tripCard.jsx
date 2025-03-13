import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { CalendarIcon, Users2Icon, MapPin } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { getUserProfile } from "@/APIs/users";
import { useState, useEffect } from "react";
import { UserAvatar, UserAvatarStack } from '../profilePage/avatar';
import { canEdit, UserRole } from "@/utils/permissions";
import { CurrentUser } from "@/APIs/auth";
import { MoreVertical, ExternalLink, Pencil, Trash2, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeaveAlert from '@/components/ui/LeaveAlert';
import DeleteAlert from '@/components/ui/DeleteAlert';
import { useNavigate } from 'react-router-dom';
import { removeMember, deleteTrip } from "@/APIs/trip.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { editTrip } from "@/APIs/trip.js";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch current user and set permissions
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await CurrentUser();
        setCurrentUser(userId);

        const role = trip.users.find(u => u.userID === userId)?.role;
        setUserRole(role);

        setIsAdmin(role === UserRole.ADMIN);

        const creatorId = typeof trip.creatorID === 'object' ? trip.creatorID.userID : trip.creatorID;
        setIsCreator(userId === creatorId);

        console.log('User permissions set:', {
          userId,
          role,
          isAdmin: role === UserRole.ADMIN,
          isCreator: userId === creatorId,
          tripCreator: trip.creatorID
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [trip.users, trip.creatorID]);

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
        const userProfile = await getUserProfile(trip.creatorID.userID || trip.creatorID);
        setCreator(userProfile);
      } catch (error) {
        console.error('Error fetching creator:', error);
      } finally {
        setIsLoadingCreator(false);
      }
    };

    fetchCreator();
  }, [trip.creatorID]);

  const handleLeave = async () => {
    try {
      await removeMember(trip.tripID, currentUser);
      window.location.reload();
    } catch (error) {
      console.error('Error leaving trip:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTrip(trip.tripID);
      onDelete?.(trip.tripID);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting trip:', error);
      setIsDeleting(false);
    }
  };

  const openInNewTab = () => {
    window.open(`/itineraryWL/${trip.tripID}`, '_blank');
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const dropdownTrigger = document.getElementById(`trip-menu-${trip.tripID}`);
    dropdownTrigger?.click();
  };

  const openRenameDialog = () => {
    setNewTripName(trip.tripName);
    setRenameError('');
    setShowRenameDialog(true);
  };

  const handleRename = async () => {
    if (!newTripName.trim()) {
      setRenameError('Trip name cannot be empty');
      return;
    }

    setIsRenaming(true);
    try {
      // Prepare update data with all original trip values
      const updateData = {
        tripName: newTripName,
        location: trip.location,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        image: trip.image
      };

      await editTrip(trip.tripID, updateData);
      setShowRenameDialog(false);

      window.location.reload();
    } catch (error) {
      console.error('Error renaming trip:', error);
      setRenameError(error.message || 'Failed to rename trip');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      <NavLink
        to={`/itinerary/${trip.tripID}`}
        className="no-underline"
        onContextMenu={handleContextMenu}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="overflow-hidden hover:bg-[#f8fffd] relative group">
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
              <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
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
            <CardFooter>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <UserAvatar
                    userId={creator?.id}
                    className="h-6 w-6"
                  />
                  <span className="text-sm text-gray-500">
                    {isLoadingCreator ? 'Loading...' : `Created by ${creator?.username || 'Unknown'}`}
                  </span>
                </div>
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
                      <DropdownMenuItem onClick={(e) => {
                        e.preventDefault();
                        openInNewTab();
                      }}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>

                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            openRenameDialog();
                          }}>
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
            </CardFooter>
          </Card>
        </motion.div>
      </NavLink>


      <LeaveAlert
        isOpen={showLeaveAlert}
        onClose={() => setShowLeaveAlert(false)}
        onConfirm={handleLeave}
      />
      <DeleteAlert
        isOpen={showDeleteAlert}
        onClose={() => {
          if (!isDeleting) setShowDeleteAlert(false);
        }}
        onConfirm={handleDelete}
        itemName="Trip"
        isLoading={isDeleting}
      />

      {/* Rename Dialog */}
      <Dialog
        open={showRenameDialog}
        onOpenChange={(open) => {
          if (!isRenaming) setShowRenameDialog(open);
        }}
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
              {renameError && <p className="text-sm text-red-500">{renameError}</p>}
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
            <Button
              onClick={handleRename}
              disabled={isRenaming}
            >
              {isRenaming ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {isRenaming ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}