// src/components/Dashboard/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { firestore, auth } from "../../firebaseConfig"; // Import auth and firestore from firebaseConfig
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth"; // Import signOut and onAuthStateChanged from firebase/auth
import "./Dashboard.css"; // Dashboard-specific styles
import { Login } from "../Authentication/Login.jsx";
import { Register } from "../Authentication/Register.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Import necessary hooks and components
import KeepTrek from "../../assets/KeepTrek.png";
import { PersonIcon } from "@primer/octicons-react";

/**
 * Dashboard component to display the user's trip history along with the header.
 *
 * @returns {React.Component} - The dashboard view with header.
 */
const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // State for controlling the visibility of login and register modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation(); // Get current location
  const [intendedUrl, setIntendedUrl] = useState(null);

  const fetchTrips = async () => {
    try {
      const tripsRef = collection(firestore, "trips");
      const q = query(tripsRef, where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      const tripsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTrips(tripsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trip history.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/"); // Redirect to landing page if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to landing page after logout
  };

  // Functions to open/close modals
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Handle button clicks by navigating to different pages
  const handleAuthSuccess = () => {
    closeModal();
    if (intendedUrl) {
      navigate(intendedUrl);
      setIntendedUrl(null); // Clear the intended URL
    } else {
      navigate("/dashboard"); // Redirect to dashboard if no intended URL
    }
  };

  const navigateToPage = (url) => {
    if (user) {
      navigate(url); // Use navigate instead of window.location.href
    } else {
      setIntendedUrl(url); // Store the intended URL
      openLoginModal(); // Open login modal if user is not authenticated
    }
  };

  return (
    <>
      {/* Header Section */}
      <div id="header">
        <div className="container">
          <nav>
            <a href="/">
              <img src={KeepTrek} alt="KeepTrek logo" className="logo" />
            </a>
            <ul>
              <li>
                <Link
                  to="/dashboard"
                  className={location.pathname === "/dashboard" ? "active" : ""}
                >
                  Dashboard
                </Link>
              </li>
              {/* Add more navigation links as needed */}
            </ul>
            {user ? (
              <div className="user-info">
                <PersonIcon size={24} />
                <span>{user.email}</span>
                <button className="Profile" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="Profile" onClick={openLoginModal}>
                Profile
                <PersonIcon size={24} />
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Render Modals */}
      {showLoginModal && (
        <Login
          closeModal={closeModal}
          switchToRegister={openRegisterModal}
          onAuthSuccess={handleAuthSuccess} // Pass the handler
        />
      )}
      {showRegisterModal && (
        <Register
          closeModal={closeModal}
          switchToLogin={openLoginModal}
          onAuthSuccess={handleAuthSuccess} // Pass the handler
        />
      )}

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <h1>Your Trip History</h1>
        {loading ? (
          <p>Loading your trips...</p>
        ) : error ? (
          <div className="error">{error}</div>
        ) : trips.length === 0 ? (
          <p>You haven't planned any trips yet. Start planning now!</p>
        ) : (
          <ul className="trip-list">
            {trips.map((trip) => (
              <li key={trip.id} className="trip-item">
                <h2>{trip.tripName}</h2>
                <p>
                  <strong>Destination:</strong> {trip.destination}
                </p>
                <p>
                  <strong>Dates:</strong>{" "}
                  {new Date(trip.startDate.seconds * 1000).toLocaleDateString()}{" "}
                  - {new Date(trip.endDate.seconds * 1000).toLocaleDateString()}
                </p>
                <p>
                  <strong>Participants:</strong> {trip.participants.join(", ")}
                </p>
                {/* Add more trip details as needed */}
                {/* Example: Link to trip details page */}
                {/* <Link to={`/trip-details/${trip.id}`} className="btn-primary">
                  View Details
                </Link> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Dashboard;
