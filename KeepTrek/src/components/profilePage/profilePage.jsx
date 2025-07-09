import React, { useState } from "react";
import { UserAvatar } from "./avatar";
import EditProfileModal from "./EditProfileModal";
import { getUserProfile, updateUserProfile } from "@/APIs/users";
import TopNavbar from "../topNavBar/TopNavbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { withSuspense } from "@/utils/withSuspense.jsx";
import { Button } from "@/components/ui/button";
import { Mail, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";

const ProfileLoadingSkeleton = () => {
  return (
    <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-100 rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col items-center space-y-4 pb-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
      <div className="bg-card rounded-lg shadow p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    </main>
  );
};

function ProfilePage () {
  const { userID } = useParams();
  const { user } = useAuth();

  const { data : userProfile , refetch } = useQuery(
    ["userProfile", userID],
  () => getUserProfile(userID),
  {
    suspense: true,
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Only run if gtag is available
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', 'G-50Y0Q2BGEQ');
    } else if (window.dataLayer) {
      // fallback for when gtag is not defined but dataLayer is
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-50Y0Q2BGEQ');
    }
  }, []);



  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await updateUserProfile(updatedProfile);
      refetch()
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    }
  };

  const renderContent = () => {
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col items-center space-y-4 pb-6">
            <UserAvatar
              src={userProfile?.image || ""}
              alt={`${userProfile?.username}'s profile picture`}
              className="w-32 h-32"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {userProfile.username}
              </h1>
              <div className="flex gap-2 items-center justify-center mt-2 text-gray-500">
                <Mail className="h-4 w-4 "/>
                <span>{userProfile.email}</span>
              </div>
            </div>
            { user === userID && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil/> Edit Profile
            </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#55C6B0]">
                {userProfile.trips}
              </div>
              <div className="text-sm text-gray-500">Trips Planned</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#55C6B0]">
                {userProfile.groups}
              </div>
              <div className="text-sm text-gray-500">Groups Joined</div>
            </div>
          </div>
        </div>

        {/* Shared Trips Section */}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      {renderContent()}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userProfile={userProfile}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default withSuspense(ProfilePage);
