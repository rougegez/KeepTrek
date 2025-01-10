import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Authentication/AuthProvider";
import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
import TeamBudgetPage from "./components/Budget/TeamBudgetPage.jsx";
import { TeamHistory } from "./components/OldBudget.jsx/TeamHistory.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
// import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import { JoinTeam } from "./components/OldBudget.jsx/JoinTeam.jsx";
import ItineraryWL from "./components/ItineraryWL/ItineraryWL.jsx";
import Wishlist from "./components/Wishlist/Wishlist.jsx";

import { MapTestPage } from "./components/MapboxMap/MapTestPage.jsx";
import CreateTrip from "./components/CreateTrip/CreateTrip.jsx";
import DateFinder from "./components/GrpSchedule/DateFinder.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">

          {/* Application Routes */}
          <div className="flex-grow">
            <Routes>
        <Route path="/" element={<TripDetailsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/expense-splitting" element={<TeamBudgetPage />} />
        <Route path="/teams/:teamId" element={<TeamBudgetPage />} />
        <Route path="/team-history" element={<TeamHistory />} />
        <Route path="/schedule" element={<DateFinder />} />
        <Route path="/schedule-summary" element={<ScheduleSummary />} />
        <Route path="/trip-details/:id" element={<TripDetailsPage />} />
        <Route path="/join-team/:teamId" element={<JoinTeam />} />
        <Route path="/itineraryWL" element={<ItineraryWL />} />
        <Route path="/schedule" element={<GrpSchedule />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/create-trip" element={<CreateTrip />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
