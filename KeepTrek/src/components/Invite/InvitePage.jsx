import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvitePreview, joinTrip } from '@/APIs/trip';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { UserAvatar, UserAvatarStack } from '../profilePage/avatar';
import { toast } from "sonner";

import { useAuth } from '../../contexts/AuthProvider';

const InvitePage = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    const { openLoginModal, openRegisterModal, isLoading, isLoggedIn } = useAuth();

    const fetchPreview = async () => {
        try {
            const response = await getInvitePreview(inviteCode);

            if (!response) {
                toast.error('Failed to load trip preview');
            }

            setPreview({
                tripID: response.tripID,
                tripName: response.tripName,
                location: response.location,
                startDate: response.startDate,
                endDate: response.endDate,
                image: response.image,
                role: response.role,
                memberCount: response.memberCount,
                isMember: !!response.membership,
                currentRole: response.membership?.role,
                creator: {
                    id: response.creatorID,
                    username: response.creatorUsername
                },
                users: response.memberIds.map(id => ({ userID: id }))
            });
        } catch (err) {
            console.error('Preview error:', err);
            if (err.response?.status === 401) {
                toast.error('Please log in to view this trip');
                openLoginModal()
            } else if (err.response?.status === 400) {
                toast.error('Invalid invite link');
            } else if (err.response?.status === 404) {
                toast.error('Trip not found');
            } else {
                toast.error('Failed to load trip preview', {
                    description: <p>{err.message}</p>
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            const checkAuth = async () => {
                if (isLoggedIn) {
                    await fetchPreview();
                }
                setLoading(false);
            }
            checkAuth();
        }
    }, [inviteCode, isLoading, isLoggedIn])

    const handleJoin = async () => {
        setJoining(true);
        try {
            const result = await joinTrip(inviteCode);
            toast.success('Successfully joined trip!');
            navigate(`/itinerary/${result.tripID}`);
        } catch (err) {
            toast.error('Failed to join trip', {
                description: <p>{err.message}</p>
            });
            setJoining(false);
        }
    };

    const getTripStatus = () => {
        if (!preview) return "upcoming";
        const currentDate = new Date();
        const startDate = new Date(preview.startDate);
        const endDate = new Date(preview.endDate);

        if (currentDate < startDate) return "upcoming";
        if (currentDate >= startDate && currentDate <= endDate) return "ongoing";
        return "completed";
    };

    const statusColors = {
        upcoming: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        ongoing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        completed: "bg-green-100 text-green-800 hover:bg-green-200",
    };

    if (isLoading || loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isLoading) {
        if (!isLoggedIn) {
            return (
                <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                    <div className="mb-8">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="h-16 w-16"
                        />
                    </div>
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle className="text-center">Welcome to KeepTrek</CardTitle>
                            <CardDescription className="text-center">
                                Please log in or register to view this trip
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex flex-col gap-2">
                            <Button
                                className="w-full"
                                onClick={() => openLoginModal()}
                            >
                                Login
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => openRegisterModal()}
                            >
                                Register
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }

        if (preview) {
            return (
                <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
                    {preview.image && (
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `url(${preview.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(10px)',
                                transform: 'scale(1.1)',
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    )}

                    <div className="relative z-10 mb-6">
                        {/* Replace with KeepTrekNew logo */}
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="h-16 w-16 mx-auto mb-4"
                        />
                    </div>

                    <div className="relative z-10 w-full max-w-md px-4">
                        <Card className="overflow-hidden shadow-xl">
                            <div className="relative h-48">
                                {preview.image ? (
                                    <img
                                        src={preview.image}
                                        alt={preview.tripName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image available</span>
                                    </div>
                                )}
                                <Badge
                                    className={`absolute top-2 right-2 ${statusColors[getTripStatus()]}`}
                                >
                                    {getTripStatus().charAt(0).toUpperCase() + getTripStatus().slice(1)}
                                </Badge>
                            </div>
                            <CardHeader className="pb-3">
                                <h3 className="text-2xl font-semibold">{preview.tripName}</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center space-x-2 text-md text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span>{preview.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-md text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{new Date(preview.startDate).toLocaleDateString()} - {new Date(preview.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <UserAvatarStack 
                                            userIds={preview.users}
                                            size={6}
                                            maxUsers={5}
                                        />
                                        <span>{preview.memberCount} participants</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4 w-full">
                                <div className="flex items-center gap-2 overflow-hidden w-full">
                                    <UserAvatar 
                                        userId={preview.creator.id}
                                        className="h-6 w-6"
                                    />
                                    <span className="text-sm text-gray-500">
                                        Created by {preview.creator.username}
                                    </span>
                                </div>
                                {preview.isMember ? (
                                    <div className="w-full">
                                        <span className="text-sm text-gray-500">
                                            You're already a member of this trip.
                                        </span>
                                        <Button 
                                            className="w-full mt-2"
                                            onClick={() => navigate(`/itinerary/${preview.tripID}`)}
                                        >
                                            View Trip
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        className="w-full" 
                                        onClick={handleJoin}
                                        disabled={joining}
                                    >
                                        {joining ? 'Joining...' : isLoggedIn ? 'Join Trip' : 'Login to Join Trip'}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            );
        }
    }
};

export default InvitePage;
