import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
import TeamBudgetPage from "./components/Budget/TeamBudgetPage.jsx"; // Import TeamBudgetPage
import { TeamHistory } from "./components/OldBudget.jsx/TeamHistory.jsx"; // Import TeamHistory
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { JoinTeam } from "./components/OldBudget.jsx/JoinTeam.jsx";
import ItineraryWL from "./components/ItineraryWL/ItineraryWL.jsx";
import Wishlist from "./components/Wishlist/Wishlist.jsx";
import Login from "./components/Authentication/login/loginPage.jsx";
import Register from "./components/Authentication/register/registerPage.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import YourTrips from "./components/yourTrips/yourTrips.jsx";
import { MapTestPage } from "./components/MapboxMap/MapTestPage.jsx";
import CreateTrip from "./components/CreateTrip/CreateTrip.jsx";
import MainExpensePage from "./components/Expenses/mainExpensePage.jsx";
import { ProfilePage } from "./components/profilePage/profilePage.jsx";
import LandingPage from "./components/yourTrips/LandingPage.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <PrivateRoute>
                <GrpSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/expense-splitting/:tripID"
            element={
              <PrivateRoute>
                <TeamBudgetPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses/:tripID"
            element={
              <PrivateRoute>
                <MainExpensePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/team-history"
            element={
              <PrivateRoute>
                <TeamHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule-summary"
            element={
              <PrivateRoute>
                <ScheduleSummary />
              </PrivateRoute>
            }
          />
          <Route
            path="/trip-details/:id"
            element={
              <PrivateRoute>
                <TripDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/join-team/:teamId"
            element={
              <PrivateRoute>
                <JoinTeam />
              </PrivateRoute>
            }
          />
          <Route
            path="/itineraryWL/:tripID"
            element={
              <PrivateRoute>
                <ItineraryWL />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist/:tripID"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/yourTrips"
            element={
              <PrivateRoute>
                <YourTrips />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <PrivateRoute>
                <CreateTrip />
              </PrivateRoute>
            }
          />
          <Route
            path="/maptest"
            element={
              <PrivateRoute>
                <MapTestPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
