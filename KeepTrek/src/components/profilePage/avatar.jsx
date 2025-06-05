import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getUserProfile } from '@/APIs/users';
import { cn } from "@/lib/utils";
import { useQuery } from 'react-query';
import { Calendar, PiggyBank, Heart, CalendarClock } from 'lucide-react';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../ui/hover-card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export function UserAvatar({
  userId,
  src,
  alt,
  hover = true,
  isIdle = null,
  currentPage = null,
  className }) {

  const navigate = useNavigate();

  const { data: userProfile, } = useQuery(
    ["userProfile", userId],
    () => getUserProfile(userId),
    {
      staleTime: Infinity,
      cacheTime: 60 * 1000 * 15, // 15 minutes
    }
  )

  const pageIcons = {
    itinerary: <Calendar size={12}/>,
    expenses: <PiggyBank size={12}/>,
    wishlist: <Heart size={12}/>,
    schedule: <CalendarClock size={12}/>,
  }

  const currentPageIcon = pageIcons[currentPage] || null;

  let avatar = null;

  if (isIdle == null) { // no isIdle specifed = default behavior
    avatar = (
      <Avatar className={cn("", className)}>
        <AvatarImage
          src={userProfile?.image || src}
          alt={userProfile?.username || alt}
        />
        <AvatarFallback>
          <User className="w-1/2 h-1/2 text-gray-500" />
        </AvatarFallback>
      </Avatar>
    );
  } else {
    avatar = ( // isIdle specified = show online/offline status
      <div className="relative inline-block">
        <Avatar className={cn(`${isIdle ? `opacity-40` : ``}`, className)}>
          <AvatarImage
            src={userProfile?.image || src}
            alt={userProfile?.username || alt}
          />
          <AvatarFallback>
            <User className="w-1/2 h-1/2 text-gray-500" />
          </AvatarFallback>
        </Avatar>
        {currentPageIcon && (
          <div
            className={`absolute bottom-0 right-0 bg-primary
              rounded-full p-1 flex items-center justify-center
              w-[20px] h-[20px] translate-x-[25%] translate-y-[25%]
              ${isIdle ? `opacity-40` : ``}`}
          >
            {currentPageIcon}
          </div>
        )}
      </div>
    );
  }

  if (hover) {
    return (
      <HoverCard>
        <HoverCardTrigger>
          {avatar}
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userProfile?.image || src}
                alt={userProfile?.username || alt}
              />
              <AvatarFallback>
                <User className="w-1/2 h-1/2 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{userProfile?.username}</p>
              <Button
                variant="link"
                onClick={() => navigate(`/profile/${userId}`)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  } else return avatar;
}

export function UserAvatarStack({
  userIds,
  size = 10,
  maxUsers = 5,
  isIdle = null,
  className }) {

  let userIDs = userIds

  // Backend has a flaw with how it tracks WebSockets, even if they are from the same user_id
  // So only the most recent WebSocket connection will receive updates
  // But previous open WebSockets from the same user can still send updates to other users, but they will not receive any themselves
  if (isIdle && isIdle.length !== 0) {
    userIDs = isIdle.map(profile => {
      const userdata = userIds.find(u => u.userID === profile.user_id);
      if (!userdata) return null; // Skip if user data is not found
      return {
        userID: profile.user_id,
        role: userdata.role,
        isIdle: profile.is_idle,
        currentPage: profile.current_page || null
      }
    }).filter(profile => profile !== null); // Filter out null values
  }


  let remainingCount = (userIDs.length || 0) - maxUsers;
  let displayedProfiles = userIDs.slice(0, maxUsers);

  return (
    <div className={cn("flex items-center", className)}>
      <div className={`flex -space-x-${Math.floor(size / 2)} rtl:space-x-reverse`}>
        {displayedProfiles.map((profile, index) => (
          <UserAvatar
            key={profile?.id || index}
            userId={profile.userID}
            isIdle={profile?.isIdle}
            currentPage={profile?.currentPage}
            className={cn(
              "ring-2 ring-background",
              `w-${size} h-${size}`
            )}
            style={{
              width: `${size * 4}px`,
              height: `${size * 4}px`,
              zIndex: displayedProfiles.length - index
            }}
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "flex items-center justify-center text-sm font-medium",
              "text-foreground-muted bg-secondary rounded-full",
              "ring-2 ring-background"
            )}
            style={{
              width: `${size * 4}px`,
              height: `${size * 4}px`,
              zIndex: displayedProfiles.length + 1
            }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;