// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoginAuthProvider } from "./components/Authentication/LoginAuthProvider";
import { AuthProvider } from "./contexts/authContext.jsx";

import LandingPage from "./components/yourTrips/LandingPage.jsx";
import YourTrips from "./components/yourTrips/yourTrips.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import CreateTrip from "./components/CreateTrip/CreateTrip.jsx";
import MainExpensePage from "./components/Expenses/mainExpensePage.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import TeamBudgetPage from "./components/Budget/TeamBudgetPage.jsx";
import { TeamHistory } from "./components/OldBudget.jsx/TeamHistory.jsx";
import { JoinTeam } from "./components/OldBudget.jsx/JoinTeam.jsx";
import Itinerary from "./components/Itinerary/Itinerary.jsx";
import Wishlist from "./components/Wishlist/Wishlist.jsx";
import { ProfilePage } from "./components/profilePage/profilePage.jsx";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import Modal from "./components/Authentication/Modal";
import LoginForm from "./components/Authentication/login/login-form";

const queryClient = new QueryClient();

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update login state
    closeLoginModal(); // Close the modal
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LoginAuthProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <div className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Protected Routes */}
                  <Route
                    element={
                      <PrivateRoute
                        isLoggedIn={isLoggedIn}
                        openLoginModal={openLoginModal}
                      />
                    }
                  >
                    <Route path="/yourTrips" element={<YourTrips />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/expense-splitting/:tripID" element={<TeamBudgetPage />} />
                    <Route path="/expenses/:tripID" element={<MainExpensePage />} />
                    <Route path="/team-history" element={<TeamHistory />} />
                    <Route path="/trip-details" element={<TripDetailsPage />} />
                    <Route path="/join-team/:teamId" element={<JoinTeam />} />
                    <Route path="/itinerary/:tripID" element={<Itinerary />} />
                    <Route path="/schedule/:tripID" element={<GrpSchedule />} />
                    <Route path="/wishlist/:tripID" element={<Wishlist />} />
                    <Route path="/create-trip" element={<CreateTrip />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </Router>

          {/* Login Modal */}
          <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </Modal>
        </AuthProvider>
      </LoginAuthProvider>
    </QueryClientProvider>
  );
}

export default App;

// npx json-server --watch db.json --port 3001

// // src/App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
// import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
// import { LandingPage } from "./components/LandingPage/LandingPage.jsx";
// import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
// import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
// import { BudgetPage } from "./components/Budget/BudgetPage.jsx";
// import { TeamBudgetPage } from "./components/Budget/TeamBudgetPage.jsx"; // Import TeamBudgetPage
// import { TeamHistory } from "./components/Budget/TeamHistory.jsx"; // Import TeamHistory
// import Dashboard from "./components/Dashboard/Dashboard.jsx";
// import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
// import { JoinTeam } from "./components/Budget/JoinTeam.jsx";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
//         <Route path="/itinerary" element={<PrivateRoute><Itinerary /></PrivateRoute>}/>
//         <Route path="/schedule" element={<PrivateRoute><GrpSchedule /></PrivateRoute>}/>
//         <Route path="/expense-splitting" element={<PrivateRoute><BudgetPage /></PrivateRoute>}/>
//         <Route path="/teams/:teamId" element={<PrivateRoute><TeamBudgetPage /></PrivateRoute>}/>
//         <Route path="/team-history" element={<PrivateRoute><TeamHistory /></PrivateRoute>}/>
//         <Route path="/schedule-summary" element={<PrivateRoute><ScheduleSummary /></PrivateRoute>}/>
//         <Route path="/trip-details/:id" element={<PrivateRoute><TripDetailsPage /></PrivateRoute>}/>
//         <Route path="/join-team/:teamId" element={<PrivateRoute><JoinTeam /></PrivateRoute>}/>
//       </Routes>
//     </Router>
//   );
// }

// export default App;