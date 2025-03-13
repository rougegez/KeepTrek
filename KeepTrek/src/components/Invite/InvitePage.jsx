import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvitePreview, joinTrip } from '@/APIs/trip';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, Users2Icon, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { UserAvatar, UserAvatarStack } from '../profilePage/avatar';
import Modal from '../Authentication/Modal';
import LoginForm from '../Authentication/login/login-form';
import { CurrentUser } from '@/APIs/auth';  
import RegisterForm from '../Authentication/register/register-form';

const InvitePage = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const currentUserId = await CurrentUser();
                    setUserId(currentUserId);
                    setIsLoggedIn(true);
                    await fetchPreview(); // Only fetch preview if authenticated
                } catch (error) {
                    console.error('Auth error:', error);
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, [inviteCode]);

    const fetchPreview = async () => {
        try {
            setError(null);
            const response = await getInvitePreview(inviteCode);
            console.log('Preview response:', response); // Debug log
            
            if (!response) {
                throw new Error('Failed to load trip preview');
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
                setError('Please log in to view this trip');
                setShowLoginModal(true);
            } else if (err.response?.status === 400) {
                setError('Invalid invite link');
            } else if (err.response?.status === 404) {
                setError('Trip not found');
            } else {
                setError('Failed to load trip preview');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        setJoining(true);
        try {
            const result = await joinTrip(inviteCode);
            navigate(`/itinerary/${result.tripID}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to join trip');
            setJoining(false);
        }
    };

    const handleLoginSuccess = async () => {
        setShowLoginModal(false);
        setIsLoggedIn(true);
        window.location.reload();
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

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

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
                            onClick={() => setShowLoginModal(true)}
                        >
                            Login
                        </Button>
                        <Button 
                            className="w-full"
                            variant="outline"
                            onClick={() => setShowRegisterModal(true)}
                        >
                            Register
                        </Button>
                    </CardFooter>
                </Card>

                <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
                    <LoginForm 
                        onLoginSuccess={handleLoginSuccess}
                        onSwitchToRegister={switchToRegister}
                    />
                </Modal>

                <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
                    <RegisterForm 
                        onSwitchToLogin={switchToLogin}
                    />
                </Modal>
            </div>
        );
    }

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
                    src="../src/assets/logo.png"
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
                    <CardHeader>
                        <h3 className="text-2xl font-semibold">{preview.tripName}</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{preview.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-md text-gray-500 mb-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(preview.startDate).toLocaleDateString()} - {new Date(preview.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <UserAvatarStack 
                                userIds={preview.users}
                                size={6}
                                maxUsers={5}
                                className="-space-x-2"
                            />
                            <span>{preview.memberCount} participants</span>
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
                            <Button 
                                className="w-full" 
                                variant="secondary"
                                disabled
                            >
                                You're already a member of this trip
                            </Button>
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

            <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </Modal>
        </div>
    );
};

export default InvitePage;
