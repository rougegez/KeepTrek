import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import LandingPage from "./yourTrips/LandingPage.jsx";

export default function AuthRedirect() {
  const { isLoggedIn, isAuthLoaded } = useAuth();

  if (!isAuthLoaded) {
    // Optionally show a loader or nothing while auth is loading
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  return <LandingPage />;
} 