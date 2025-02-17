import React from 'react';
import { Avatar } from './avatar';
import { EditProfile } from './EditProfile';
import EditProfileModal from './EditProfileModal';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/APIs/users';
import { CurrentUser } from '@/APIs/auth';  
import TopNavbar from '../topNavBar/TopNavbar';
import TripsList from '../yourTrips/tripList';
import { getUserTrips } from '@/APIs/trip';
import { motion } from 'framer-motion'
import { Skeleton } from "@/components/ui/skeleton"

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
      )
    }
  
export const ProfilePage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        tripsPlanned: 12,
        groupsJoined: 4
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const userId = await CurrentUser();
                const profile = await getUserProfile(userId);
                
                if (!profile) {
                    throw new Error('No profile data received');
                }
                setUserProfile(profile);

                // Fetch trips
                const userTrips = await getUserTrips();
                setTrips(userTrips);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProfileUpdate = async (updatedProfile) => {
        try {
            await updateUserProfile(updatedProfile);
            setUserProfile(prev => ({
                ...prev,
                ...updatedProfile
            }));
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message);
        }
    };

    const renderContent = () => {
        if (isLoading) return <ProfileLoadingSkeleton />
        if (error) return <div className="text-red-500">Error: {error}</div>

        return (
            <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col items-center space-y-4 pb-6">
                        <Avatar 
                            src={userProfile?.image || ''} 
                            alt={`${userProfile?.username}'s profile picture`}
                            className="w-32 h-32 rounded-full"
                        />
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
                            <div className="flex items-center justify-center mt-2 text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{userProfile.email}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-[#55C6B0] hover:bg-[#4AB19C] text-white px-4 py-2 rounded-md flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Profile
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-[#55C6B0]">{userData.tripsPlanned}</div>
                            <div className="text-sm text-gray-500">Trips Planned</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-3xl font-bold text-[#55C6B0]">{userData.groupsJoined}</div>
                            <div className="text-sm text-gray-500">Groups Joined</div>
                        </div>
                    </div>
                </div>

                {/* Shared Trips Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Shared Trips</h2>
                    <TripsList trips={trips}/>
                </div>
            </main>
        )
    }


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

export default ProfilePage;