// src/components/PrivateRoute/PrivateRoute.jsx

import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "sonner";

const PrivateRoute = () => {
  const location = useLocation();

  const { isLoggedIn, openLoginModal, isAuthLoaded} = useAuth();

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      openLoginModal(); // Open the login modal
    }
  }, [isAuthLoaded, isLoggedIn, openLoginModal]);

  if (isAuthLoaded && !isLoggedIn) {
    toast.error("Please login to access this page");
    return <Navigate to="/" state={{ from: location }} replace />; // Redirect to landing page if modal is closed
  }

  return <Outlet />; // Render the protected route if logged in
};

export default PrivateRoute;
