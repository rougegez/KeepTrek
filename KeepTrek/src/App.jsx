import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
import TripDetailsPage from "./components/TripDetails/Trips.jsx";
import { LandingPage } from "./components/LandingPage/LandingPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/schedule" element={<GrpSchedule />} />
        <Route path="/trip-details/:id" element={<TripDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
