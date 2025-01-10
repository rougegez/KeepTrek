import React, { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Modal from "@/components/Authentication/Modal"; // Import the reusable Modal
import LoginForm from "@/components/Authentication/login/login-form"; // Login Form Component
import RegisterForm from "@/components/Authentication/register/register-form"; // Register Form Component

export default function TopNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for Login Modal
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State for Register Modal
    const navigate = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser || { username: 'Guest' });
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/'); // Redirect to the homepage
    };

    // Modal switching functions
    const switchToRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const switchToLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    return (
        <>
            <nav className="bg-white shadow-sm">
                <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 py-1">
                        <div className="flex-shrink-0 flex items-center max-w-44">
                            <NavLink to="/yourTrips" className="text-2xl font-bold text-gray-800">
                                <img src="../src/assets/KeepTrekNew.png" className="object-scale-down" />
                            </NavLink>
                        </div>
                        <div className="flex sm:ml-6 sm:flex sm:space-x-8">
                            <NavLink
                                to="/yourTrips"
                                className="border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Trips
                            </NavLink>
                            <NavLink
                                to="/travel-guides"
                                className="border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Travel Guides
                            </NavLink>
                            <NavLink
                                to="/how-it-works"
                                className="border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                How it works
                            </NavLink>
                            <NavLink
                                to="/about-us"
                                className="border-transparent hover:border-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                About Us
                            </NavLink>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {isLoggedIn ? (
                                <>
                                    <Button asChild className="mr-4">
                                        <NavLink
                                            to="/create-trip"
                                            className="border-transparent inline-flex text-sm font-semibold"
                                        >
                                            Create Itinerary
                                        </NavLink>
                                    </Button>
                                    <Button size="icon" variant="ghost" className="m-2 rounded-full">
                                        <Bell className="h-4 w-4" aria-hidden="true" />
                                    </Button>
                                    <NavLink to="/profile">
                                        <Avatar>
                                            <AvatarFallback className="bg-gray-100">
                                                <User className="h-5 w-5 text-gray-500" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </NavLink>
                                    <Button
                                        className="ml-4 text-sm font-semibold text-red-600"
                                        variant="ghost"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="text-sm font-semibold"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={() => setIsRegisterModalOpen(true)}
                                        className="ml-2 text-sm font-semibold"
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
                <LoginForm onSwitchToRegister={switchToRegister} />
            </Modal>

            {/* Register Modal */}
            <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
                <RegisterForm onSwitchToLogin={switchToLogin} />
            </Modal>
        </>
    );
}
