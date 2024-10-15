// src/components/PrivateRoute/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

/**
 * PrivateRoute component to protect routes that require authentication.
 *
 * @param {React.Component} children - The component to render if authenticated.
 * @returns {React.Component} - The child component or a redirect to the landing page.
 */
const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loader
  }

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
