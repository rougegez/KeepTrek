// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx"; // Named import
import { LandingPage } from "./components/LandingPage/LandingPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
import { BudgetPage } from "./components/Budget/BudgetPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/schedule" element={<GrpSchedule />} />
        <Route path="/expense-splitting" element={<BudgetPage />} />
        <Route path="/schedule-summary" element={<ScheduleSummary />} />
        <Route path="/trip-details/:id" element={<TripDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
