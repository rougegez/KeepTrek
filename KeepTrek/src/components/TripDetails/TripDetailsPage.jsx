// src/components/TripDetails/TripDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import KeepTrek from "../../assets/KeepTrek.png";
import "./TripDetailsPage.css";
import { Login } from "../Authentication/Login";
import { Register } from "../Authentication/Register";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from "./Sidebar/Sidebar.jsx";
import SampleMap from "./Map/SampleMap.jsx";
import TripBuddy from "./TripBuddy/TripBuddy.jsx";
import TripOverview from "./TripOverview/TripOverview.jsx";
import Notes from "./Notes/Notes.jsx";
import Attachments from "./Attachments/Attachments.jsx";
import TripSummary from "./TripSummary/TripSummary.jsx";
import Accommodation from "./Accomodation/Accommodation.jsx";

// Helper function to generate the list of dates between start and end date


export const TripDetailsPage = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the itinerary id from the URL
  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const toggleMapExpansion = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowLoginModal(false);
        setShowRegisterModal(false);
      } else {
        setUser(null);
        setShowLoginModal(true); // Show login modal if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itinerary) {
        try {
          const docRef = doc(firestore, "users", user.uid, "itineraries", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setItinerary({ id: docSnap.id, ...docSnap.data() }); // Set fetched itinerary
          } else {
            console.error("No such itinerary found!");
          }
        } catch (error) {
          console.error("Error fetching itinerary: ", error);
        }
      }
    };

    if (user) {
      fetchItinerary();
    }
  }, [id, itinerary, user]);

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

  if (!user) {
    return null; // Return null while authentication is being checked
  }

  if (!itinerary) {
    return <p>Loading itinerary...</p>;
  }

  return (
    <div className="trip-details-container">
      <Sidebar />
      <div className="main-page">
        <div className="content-wrapper">
          <main>
            <TripOverview
              title="East Coast Road-Trip"
              dateRange="19 June 2024 to 23 June 2024"
              backgroundImage="../src/assets/Langkawi.jpg"
              id="Overview"
            />
            <div id="TripSummary">
            <h2 className="trip-summary-title">Trip Summary</h2>
              <TripSummary/>
            </div>
            <div id="Accommodation">
              <Accommodation/>
            </div>
            <div id="TripBuddy">
              <TripBuddy />
            </div>
            <div id="Notes">
              <Notes />
            </div>
            <div id="Attachments">
              <Attachments />
            </div>
          </main>

          {/* <div className={`map-wrapper ${isMapExpanded ? 'expanded' : ''}`}>
            <button
              className="toggle-map-button"
              onClick={toggleMapExpansion}
              aria-label={isMapExpanded ? 'Collapse map' : 'Expand map'}
            >
              {isMapExpanded ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
            <div className="map-container">
              <SampleMap />
            </div>
          </div> */}
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <Login
          closeModal={handleCloseModal}
          switchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showRegisterModal && (
        <Register
          closeModal={handleCloseModal}
          switchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};