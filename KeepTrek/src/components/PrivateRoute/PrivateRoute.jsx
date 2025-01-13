// src/components/PrivateRoute/PrivateRoute.jsx

import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, openLoginModal }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal(); // Open the login modal
    }
  }, [isLoggedIn, openLoginModal]);

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />; // Redirect to landing page if modal is closed
  }

  return <Outlet />; // Render the protected route if logged in
};

export default PrivateRoute;
