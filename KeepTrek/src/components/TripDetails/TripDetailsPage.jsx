import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./TripDetailsPage.css";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MobileHeader from "../MobileHeader";
import TripBuddy from "./TripBuddy/TripBuddy.jsx";
import TripOverview from "./TripOverview/TripOverview.jsx";
import Notes from "./Notes/Notes.jsx";
import Attachments from "./Attachments/Attachments.jsx";
import TripSummary from "./TripSummary/TripSummary.jsx";
import Accommodation from "./Accomodation/Accommodation.jsx";
import { useMediaQuery } from 'react-responsive';

export const TripDetailsPage = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the itinerary id from the URL
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    // Mock fetch for itinerary if not provided in location state
    const fetchItinerary = async () => {
      if (!itinerary) {
        try {
          // Simulate API call
          const fetchedItinerary = {
            id,
            title: "East Coast Road-Trip",
            dateRange: "19 June 2024 to 23 June 2024",
          };
          setItinerary(fetchedItinerary);
        } catch (error) {
          console.error("Error fetching itinerary:", error);
        }
      }
    };

    fetchItinerary();
  }, [id, itinerary]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    navigate("/");
  };

  if (!itinerary) {
    return <p>Loading itinerary...</p>;
  }

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      {!isMobile && <SidebarTrigger />}
      {isMobile && <MobileHeader title="Overview" />}

      <main className="main-page">

        <TripOverview
          title={itinerary.title}
          dateRange={itinerary.dateRange}
          backgroundImage="../src/assets/Langkawi.jpg"
        />
        <div id="TripSummary">
          <h2 className="trip-summary-title">Trip Summary</h2>
          <TripSummary />
        </div>
        <div id="Accommodation">
          <Accommodation />
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

      {/* Modals */}
      {showLoginModal && (
        <Login
          closeModal={handleCloseModal}
          switchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <Register
          closeModal={handleCloseModal}
          switchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </SidebarProvider>
  );
};

