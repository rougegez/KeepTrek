// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
import { LandingPage } from "./components/LandingPage/LandingPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
import { BudgetPage } from "./components/Budget/BudgetPage.jsx";
import { TeamBudgetPage } from "./components/Budget/TeamBudgetPage.jsx"; // Import TeamBudgetPage
import { TeamHistory } from "./components/Budget/TeamHistory.jsx"; // Import TeamHistory
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import { JoinTeam } from "./components/Budget/JoinTeam.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/itinerary" element={<PrivateRoute><Itinerary /></PrivateRoute>}/>
        <Route path="/schedule" element={<PrivateRoute><GrpSchedule /></PrivateRoute>}/>
        <Route path="/expense-splitting" element={<PrivateRoute><BudgetPage /></PrivateRoute>}/>
        <Route path="/teams/:teamId" element={<PrivateRoute><TeamBudgetPage /></PrivateRoute>}/>
        <Route path="/team-history" element={<PrivateRoute><TeamHistory /></PrivateRoute>}/>
        <Route path="/schedule-summary" element={<PrivateRoute><ScheduleSummary /></PrivateRoute>}/>
        <Route path="/trip-details/:id" element={<PrivateRoute><TripDetailsPage /></PrivateRoute>}/>
        <Route path="/join-team/:teamId" element={<PrivateRoute><JoinTeam /></PrivateRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
