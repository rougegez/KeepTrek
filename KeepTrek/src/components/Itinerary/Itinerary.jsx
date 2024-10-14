// src/components/Itinerary/Itinerary.jsx

import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import KeepTrek from "../../assets/KeepTrek.png";
import "./Itinerary.css";
import { Login } from "../Authentication/Login";
import { Register } from "../Authentication/Register";

export const Itinerary = () => {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowLoginModal(false);
        setShowRegisterModal(false);
        await fetchUserItineraries(currentUser.uid); // Fetch itineraries upon login
      } else {
        setUser(null);
        setShowLoginModal(true); // Show login modal if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch existing itineraries for the user
  const fetchUserItineraries = async (userId) => {
    try {
      const itinerariesRef = collection(
        firestore,
        "users",
        userId,
        "itineraries"
      );
      const q = query(itinerariesRef);
      const querySnapshot = await getDocs(q);
      const fetchedItineraries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItineraries(fetchedItineraries);
    } catch (error) {
      console.error("Error fetching itineraries: ", error);
    }
  };

  // Function to handle creating a new itinerary
  const handleCreateItinerary = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (!tripName || !startDate || !endDate) {
        alert("Please fill out all fields.");
        return;
      }

      // Validate date inputs
      if (new Date(startDate) > new Date(endDate)) {
        alert("Start Date cannot be after End Date.");
        return;
      }

      const newItinerary = {
        TripName: tripName,
        StartDate: new Date(startDate),
        EndDate: new Date(endDate),
        timestamp: new Date(),
      };

      const itinerariesRef = collection(
        firestore,
        "users",
        user.uid,
        "itineraries"
      );
      const docRef = await addDoc(itinerariesRef, newItinerary);

      // Optionally, you can listen for real-time updates instead of manually updating the state
      // For immediate navigation after creation:
      navigate(`/trip-details/${docRef.id}`, {
        state: { itinerary: { id: docRef.id, ...newItinerary } },
      });

      // Reset form fields
      setTripName("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding itinerary: ", error);
      alert("Error adding trip: " + error.message);
    }
  };

  // Function to navigate to the details page of an itinerary
  const handleItineraryClick = (itinerary) => {
    navigate(`/trip-details/${itinerary.id}`, { state: { itinerary } });
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setUser(auth.currentUser);
  };

  // Function to handle closing the modal and redirecting to home
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    navigate("/");
  };

  return (
    <>
      {/* Header/Navbar */}
      <header id="grp-header" className="grp-navbar">
        <div className="grp-container">
          <div className="grp-navbar-left">
            <button onClick={() => navigate("/")} className="grp-logo-btn">
              <img src={KeepTrek} alt="KeepTrek Logo" className="grp-logo" />
            </button>
            <button
              onClick={() => navigate("/itinerary")}
              className="grp-nav-link"
            >
              Itinerary
            </button>
            <button
              onClick={() => navigate("/schedule")}
              className="grp-nav-link"
            >
              Group Scheduling
            </button>
          </div>
          <div className="grp-navbar-right">
            <button onClick={() => navigate("#")} className="grp-nav-link">
              How it Works
            </button>
            <button
              onClick={() => navigate("/schedule-summary")}
              className="grp-nav-link"
            >
              History
            </button>
            {user ? (
              <button
                className="grp-profile-btn"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            ) : (
              <button
                className="grp-profile-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="itinerary-page">
        <div className="grp-content">
          <h1>Create Your Trip</h1>
          <div className="form-group">
            <input
              type="text"
              placeholder="Trip Name"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="input-field"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
            <button onClick={handleCreateItinerary} className="btn-primary">
              Submit
            </button>
          </div>

          <h2>Your Itineraries</h2>
          {itineraries.length > 0 ? (
            <ul className="itinerary-list">
              {itineraries.map((itinerary) => (
                <li key={itinerary.id} className="itinerary-item">
                  <button
                    onClick={() => handleItineraryClick(itinerary)}
                    className="itinerary-button"
                  >
                    {itinerary.TripName}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no itineraries yet.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <Login
          closeModal={handleCloseModal} // Redirects to home on close
          switchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showRegisterModal && (
        <Register
          closeModal={handleCloseModal} // Redirects to home on close
          switchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};
