// src/components/PrivateRoute/PrivateRoute.jsx

import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "sonner";

const PrivateRoute = ({ adminOnly = false }) => {
  const location = useLocation();
  const { isLoggedIn, openLoginModal } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
    }
  }, [isLoggedIn, openLoginModal]);

  if (!isLoggedIn) {
    toast.error("Please login to access this page");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // New check for admin-only routes using session storage
  if (adminOnly) {
    const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAdminAuthenticated) {
      toast.info("You must enter the admin secret code to access this page.");
      // Redirect to a new admin login page, passing the original location
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  }

  return <Outlet />; // Render the protected route if authorized
};

export default PrivateRoute;
