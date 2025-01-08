// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Itinerary } from "./components/Itinerary/Itinerary.jsx";
import { TripDetailsPage } from "./components/TripDetails/TripDetailsPage.jsx";
import { GrpSchedule } from "./components/GrpSchedule/GrpSchedule.jsx";
import { ScheduleSummary } from "./components/GrpSchedule/ScheduleSummary";
import { BudgetPage } from "./components/OldBudget.jsx/BudgetPage.jsx";
import TeamBudgetPage from "./components/Budget/TeamBudgetPage.jsx"; // Import TeamBudgetPage
import { TeamHistory } from "./components/OldBudget.jsx/TeamHistory.jsx"; // Import TeamHistory
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import { JoinTeam } from "./components/OldBudget.jsx/JoinTeam.jsx";
import ItineraryWL from "./components/ItineraryWL/ItineraryWL.jsx";
import Wishlist from "./components/Wishlist/Wishlist.jsx";
import Login from "./components/Authentication/login/loginPage.jsx";
import Register from "./components/Authentication/register/registerPage.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
// import { LandingPage } from "./components/LandingPage/LandingPage.jsx";
import YourTrips from "./components/yourTrips/yourTrips.jsx";
import { MapTestPage } from "./components/MapboxMap/MapTestPage.jsx";
import CreateTrip from "./components/CreateTrip/CreateTrip.jsx";
import MainExpensePage from "./components/Expenses/mainExpensePage.jsx";
import {ProfilePage} from "./components/profilePage/profilePage.jsx";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<YourTrips />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<GrpSchedule />} />
        <Route path="/expense-splitting/:tripID" element={<TeamBudgetPage />} />
        <Route path="/expenses/:tripID" element={<MainExpensePage />} />
        <Route path="/team-history" element={<TeamHistory />} />
        <Route path="/schedule-summary" element={<ScheduleSummary />} />
        <Route path="/trip-details/:id" element={<TripDetailsPage />} />
        <Route path="/join-team/:teamId" element={<JoinTeam />} />
        <Route path="/itineraryWL/:tripID" element={<ItineraryWL />} />
        <Route path="/schedule/:tripID" element={<GrpSchedule />} />
        <Route path="/wishlist/:tripID" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/landing" element={<LandingPage/>}/> */}
        <Route path="/yourTrips" element={<YourTrips />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/maptest" element={<MapTestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
    </AuthProvider>
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
