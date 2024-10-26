// src/components/TripDetails/TripDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import KeepTrek from "../../assets/KeepTrek.png";
import "./TripDetailsPage.css";
import { Login } from "../Authentication/Login";
import { Register } from "../Authentication/Register";
import Sidebar from "./Sidebar/Sidebar";

// Helper function to generate the list of dates between start and end date
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const stopDate = new Date(endDate);

  while (currentDate <= stopDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Utility function to normalize date
const normalizeDate = (date) => {
  if (date && typeof date.toDate === "function") {
    return date.toDate();
  }
  return new Date(date);
};

export const TripDetailsPage = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the itinerary id from the URL
  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
  const [selectedDay, setSelectedDay] = useState(null); // State for the selected day
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

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

  // Handle the click on a day button
  const handleDayClick = (day) => {
    setSelectedDay(day); // Set the selected day to show the planning section
  };

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

  // Normalize dates
  const startDate = normalizeDate(itinerary.StartDate);
  const endDate = normalizeDate(itinerary.EndDate);

  // Generate the date range based on the start and end dates
  const dateRange = generateDateRange(startDate, endDate);

  return (
    <>
      {/* Top Nav Bar */}
      <header id="grp-header" className="grp-navbar">
        {/* ... Your existing top navbar code ... */}
      </header>

      <div className="trip-details-layout">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Body*/}
        <div className="trip-details-page">
          <div className="grp-content">
            <h1>Trip Details</h1>
            <h2>{itinerary.TripName}</h2>

            <h3>Select a Day to Plan:</h3>
            <ul className="date-list">
              {dateRange.map((date, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleDayClick(date)}
                    className={`date-button ${selectedDay &&
                      selectedDay.toDateString() === date.toDateString()
                      ? "selected"
                      : ""
                    }`}
                  >
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </button>
                </li>
              ))}
            </ul>

            {selectedDay && (
              <div className="planning-section">
                <h3>
                  Plan for{" "}
                  {selectedDay.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>

                <textarea
                  placeholder="Enter your plan for the day..."
                  className="input-textarea"
                ></textarea>
                <button className="btn-primary">Save Plan</button>
              </div>
            )}
          </div>
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
    </>
  );
};