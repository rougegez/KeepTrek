import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getUserProfile } from '@/APIs/users';
import { cn } from "@/lib/utils";

export function UserAvatar({
  userId,
  src,
  alt,
  isIdle = null,
  currentPage = null,
  className }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      getUserProfile(userId).then(profile => {
        setUserProfile(profile);
      }).catch(error => {
        console.error('Error fetching user profile:', error);
      });
    }
  }, [userId]);

  if (isIdle == null) { // no isIdle specifed = default behavior
    return (
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
    return ( // isIdle specified = show online/offline status
      <Avatar className={cn(`${isIdle ? `opacity-40` : ``}`, className)}>
        <AvatarImage
          src={userProfile?.image || src}
          alt={userProfile?.username || alt}
        />
        <AvatarFallback>
          <User className="w-1/2 h-1/2 text-gray-500" />
        </AvatarFallback>
      </Avatar>
    );
  }
}

export function UserAvatarStack({
  userIds,
  size = 10,
  maxUsers = 5,
  isIdle = null,
  className }) {

  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        if (!userIds || !Array.isArray(userIds)) {
          console.log('Invalid userIds:', userIds);
          return;
        }

        // Extract userID from objects if necessary
        const normalizedIds = userIds.map(id => 
          typeof id === 'object' ? id.userID : id
        );

        const profilesToFetch = normalizedIds.slice(0, maxUsers);
        console.log('Fetching profiles for:', profilesToFetch);
        
        const profiles = await Promise.all(
          profilesToFetch.map(id => getUserProfile(id))
        );
        console.log('Fetched profiles:', profiles);
        setUserProfiles(profiles.filter(Boolean));
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };

    fetchUserProfiles();
  }, [userIds, maxUsers, isIdle]);

  if (isIdle) {
    const updatedProfiles = userProfiles.map(profile => {
      const idleData = isIdle.find(u => u.userID === profile.id);
      return {
        ...profile,
        isIdle: idleData?.isIdle ?? null,
        currentPage: idleData?.current_page ?? null
      };
    });
    // setUserProfiles(updatedProfiles);
  }


  const remainingCount = (userProfiles.length || 0) - maxUsers;
  const displayedProfiles = userProfiles.slice(0, maxUsers);

  return (
    <div className={cn("flex items-center", className)}>
      <div className={`flex -space-x-${Math.floor(size / 2)} rtl:space-x-reverse`}>
        {displayedProfiles.map((profile, index) => (
          <UserAvatar
            key={profile?.id || index}
            userId={profile?.id}
            src={profile?.image}
            alt={profile?.username}
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