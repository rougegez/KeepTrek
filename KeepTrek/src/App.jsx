// src/App.js
import React from "react";
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
import InvitePage from "./components/Invite/InvitePage";
import { Toaster } from "@/components/ui/sonner";
import { WhosOnlineWrapper } from "./components/CreateTrip/WhosOnlineWrapper";
import { MapProvider } from "react-map-gl/mapbox";
import ItinerarySocketWrapper from "@/components/Itinerary/ItinerarySocketWrapper";
import { Analytics } from "@vercel/analytics/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import BrowseActivity from "./components/BrowseActivity/BrowseActivity.jsx";
import BlogEditor from "./components/Blog/BlogEditor";
// import { SpeedInsights } from "@vercel/speed-insights/next"
import AddActivityPage from "./components/Admin/AddActivityPage";
import AdminLoginPage from "./components/Admin/AdminLoginPage";
import AdminDashboard from "./components/Admin/AdminDashboard";

const queryClient = new QueryClient();

function AgodaVerificationPage() {
  return (
    <div>agoda-partner-site-verification: AgodaPartnerVerification.html</div>
  );
}

function App() {
  return (
    <>
      <Analytics />
      {/* <SpeedInsights/> */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MapProvider>
            <TooltipProvider>
              <Router>
                <div className="min-h-screen flex flex-col">
                  <div className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route
                        path="/join/:inviteCode"
                        element={<InvitePage />}
                      />
                      <Route
                        path="/AgodaPartnerVerification.html"
                        element={<AgodaVerificationPage />}
                      />
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      {/* <Route path="/blog" element={<BlogEditor/>} /> */}
                      {/* Protected Routes */}
                      <Route element={<PrivateRoute />}>
                        <Route path="/yourTrips" element={<YourTrips />} />
                        <Route element={<WhosOnlineWrapper />}>
                          <Route element={<ItinerarySocketWrapper />}>
                            <Route
                              path="/expenses/:tripID"
                              element={<MainExpensePage />}
                            />
                            <Route
                              path="/itinerary/:tripID"
                              element={<Itinerary />}
                            />
                            {/* <Route path="/trip-details" element={<TripDetailsPage />} /> */}
                            <Route
                              path="/schedule/:tripID"
                              element={<GrpSchedule />}
                            />
                            <Route
                              path="/wishlist/:tripID"
                              element={<Wishlist />}
                            />
                            <Route
                              path="/browse-activities/:tripID"
                              element={<BrowseActivity />}
                            />
                          </Route>
                        </Route>
                        <Route path="/create-trip" element={<CreateTrip />} />
                        <Route path="/profile" element={<ProfilePage />} />
                      </Route>
                      {/* Admin Route */}
                      <Route element={<PrivateRoute adminOnly={true} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/add-activity" element={<AddActivityPage />} />
                      </Route>
                    </Routes>
                  </div>
                </div>
              </Router>
            </TooltipProvider>
          </MapProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster position="top-center" closeButton />
    </>
  );
}

export default App;

// npx json-server --watch db.json --port 3001
