// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./contexts/AuthProvider";

import LandingPage from "./components/yourTrips/LandingPage.jsx";
import YourTrips from "./components/yourTrips/yourTrips.jsx";

import CreateTrip from "./components/CreateTrip/CreateTrip.jsx";
import MainExpensePage from "./components/Expenses/mainExpensePage.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Itinerary from "./components/Itinerary/Itinerary.jsx";
import Wishlist from "./components/Wishlist/Wishlist.jsx";
import { ProfilePage } from "./components/profilePage/profilePage.jsx";
// import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import InvitePage from './components/Invite/InvitePage';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <div className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/join/:inviteCode" element={<InvitePage />} />

                  {/* Protected Routes */}
                  <Route
                    element={
                      <PrivateRoute
                      />
                    }
                  >
                    <Route path="/yourTrips" element={<YourTrips />} />
                    <Route path="/expenses/:tripID" element={<MainExpensePage />} />
                    <Route path="/itinerary/:tripID" element={<Itinerary />} />
                    {/* <Route path="/trip-details" element={<TripDetailsPage />} /> */}
                    <Route path="/schedule/:tripID" element={<GrpSchedule />} />
                    <Route path="/wishlist/:tripID" element={<Wishlist />} />
                    <Route path="/create-trip" element={<CreateTrip />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

// npx json-server --watch db.json --port 3001