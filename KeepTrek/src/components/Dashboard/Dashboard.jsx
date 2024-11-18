// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
// import { firestore, auth } from "../../firebaseConfig";
// import { collection, query, getDocs } from "firebase/firestore";
// import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Dashboard.css";
// import { Login } from "../Authentication/Login.jsx";
// import { Register } from "../Authentication/Register.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import KeepTrek from "../../assets/KeepTrek.png";
import { PersonIcon } from "@primer/octicons-react";
import dummyImage from "../../assets/dummy-image.jpg";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [intendedUrl, setIntendedUrl] = useState(null);

  const fetchTrips = async () => {
    try {
      const tripsRef = collection(
        firestore,
        "users",
        auth.currentUser.uid,
        "itineraries"
      );
      const q = query(tripsRef);
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
    if (auth.currentUser) {
      fetchTrips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

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

  const handleAuthSuccess = () => {
    closeModal();
    if (intendedUrl) {
      navigate(intendedUrl);
      setIntendedUrl(null);
    } else {
      navigate("/dashboard");
    }
  };

  const navigateToPage = (url) => {
    if (user) {
      navigate(url);
    } else {
      setIntendedUrl(url);
      openLoginModal();
    }
  };

  const handleAddNewTrip = () => {
    navigate("/itinerary");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* Header Section */}
      <div id="dashboard-header">
        <div className="navbar-container">
          <nav>
            <div className="nav-left">
              <button onClick={handleLogoClick} className="logo-btn">
                <img src={KeepTrek} alt="KeepTrek logo" className="logo" />
              </button>
            </div>
            <div className="nav-center">
              <ul>
                <li>
                  <Link
                    to="/dashboard"
                    className={
                      location.pathname === "/dashboard" ? "active" : ""
                    }
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/itinerary">Itinerary</Link>
                </li>
                <li>
                  <Link to="/schedule">Group Scheduling</Link>
                </li>
                <li>
                  <Link to="/schedule-summary">History</Link>
                </li>
              </ul>
            </div>
            <div className="nav-right">
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
            </div>
          </nav>
        </div>
      </div>

      {/* Render Modals */}
      {showLoginModal && (
        <Login
          closeModal={closeModal}
          switchToRegister={openRegisterModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      {showRegisterModal && (
        <Register
          closeModal={closeModal}
          switchToLogin={openLoginModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <h1>Your Itinerary</h1>

        <div className="itinerary-section">
          {/* Add new itinerary card */}
          <div className="itinerary-card add-new" onClick={handleAddNewTrip}>
            <span>+</span>
          </div>

          {/* Display trips */}
          {loading ? (
            <p>Loading your trips...</p>
          ) : error ? (
            <div className="error">{error}</div>
          ) : trips.length === 0 ? (
            <p>You haven't planned any trips yet. Start planning now!</p>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="itinerary-card"
                onClick={() =>
                  navigate(`/trip-details/${trip.id}`, {
                    state: { itinerary: trip },
                  })
                }
              >
                <img
                  src={dummyImage}
                  alt="Trip Thumbnail"
                  className="trip-image"
                />
                <div className="trip-details">
                  <h2>{trip.TripName}</h2>
                  <p>
                    {trip.StartDate.toDate().toLocaleDateString()} -{" "}
                    {trip.EndDate.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
