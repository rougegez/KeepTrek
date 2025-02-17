import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getUserProfile } from '@/APIs/users';
import { cn } from "@/lib/utils";

export function UserAvatar({ userId, src, alt, className }) {
    return (
      <Avatar className={className}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>
          <User className="w-1/2 h-1/2 text-gray-500" />
        </AvatarFallback>
      </Avatar>
    );
  }

export function UserAvatarStack({ 
  userIds, 
  size = 10, 
  maxUsers = 5,
  className 
}) {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const profilesToFetch = userIds.slice(0, maxUsers);
        const profiles = await Promise.all(profilesToFetch.map(id => getUserProfile(id)));
        setUserProfiles(profiles);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };

    fetchUserProfiles();
  }, [userIds, maxUsers]);

  const remainingCount = userIds.length - maxUsers;
  const displayedProfiles = userProfiles.slice(0, maxUsers);

  return (
    <div className={cn("flex items-center", className)}>
      <div class="flex -space-x-4 rtl:space-x-reverse">
        {displayedProfiles.reverse().map((profile, index) => (
          <UserAvatar
            key={profile.id}
            src={profile.image}
            alt={profile.username}
            className={cn(
              "border-2 border-background",
              `w-${size} h-${size}`
            )}
            style={{ 
              zIndex: displayedProfiles.length - index
            }}
          />
        ))}
        {remainingCount > 0 && (
          <a 
            className={`flex items-center justify-center w-${size} h-${size} text-sm font-medium text-foreground-muted bg-secondary rounded-full border-2 border-background`} 
            style={{zIndex: displayedProfiles.length + 1}}
          >
            +{remainingCount}
          </a>
        )}
      </div>
    </div>
  );
}

export default Avatar;