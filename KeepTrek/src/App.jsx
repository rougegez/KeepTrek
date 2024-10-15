// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx"; // Named import
import { LandingPage } from "./components/LandingPage/LandingPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
import { BudgetPage } from "./components/Budget/BudgetPage.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx"; // Import Dashboard
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx"; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/schedule" element={<GrpSchedule />} />
        <Route path="/expense-splitting" element={<BudgetPage />} />
        <Route path="/schedule-summary" element={<ScheduleSummary />} />
        <Route path="/trip-details/:id" element={<TripDetailsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
