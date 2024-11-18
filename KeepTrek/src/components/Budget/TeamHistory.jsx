// src/components/Budget/TeamHistory.jsx
import React, { useEffect, useState } from "react";
// import { auth, firestore } from "../../firebaseConfig";
// import {
//   getDocs,
//   collection,
//   query,
//   where,
//   doc,
//   getDoc,
// } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import KeepTrek from "../../assets/KeepTrek.png";
import "./TeamHistory.css";

export const TeamHistory = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserTeams(currentUser.uid);
      } else {
        setUser(null);
        navigate("/expense-splitting");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserTeams = async (userId) => {
    try {
      const teamsRef = collection(firestore, "teams");
      const q = query(teamsRef, where("members", "array-contains", userId));
      const querySnapshot = await getDocs(q);

      const teamsData = [];
      querySnapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() });
      });

      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  return (
    <>
      <header id="grp-header" className="grp-navbar">
        <div className="grp-container">
          <div className="grp-navbar-left">
            <button onClick={() => navigate("/")} className="grp-logo-btn">
              <img src={KeepTrek} alt="KeepTrek Logo" className="grp-logo" />
            </button>
            <button
              onClick={() => navigate("/itinerary")}
              className="grp-nav-link"
            >
              Itinerary
            </button>
            <button
              onClick={() => navigate("/schedule")}
              className="grp-nav-link"
            >
              Group Scheduling
            </button>
          </div>
          <div className="grp-navbar-right">
            <button onClick={() => navigate("#")} className="grp-nav-link">
              How it Works
            </button>
            <button
              onClick={() => navigate("/schedule-summary")}
              className="grp-nav-link"
            >
              History
            </button>
            {user ? (
              <button
                className="grp-profile-btn"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            ) : (
              <button
                className="grp-profile-btn"
                onClick={() => navigate("/expense-splitting")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="team-history-page">
        <h2>Your Teams</h2>
        {teams.length > 0 ? (
          <ul className="team-list">
            {teams.map((team) => (
              <li key={team.id}>
                <h3>{team.name}</h3>
                <p>Team ID: {team.id}</p>
                <button
                  className="budget-btn-primary"
                  onClick={() => navigate(`/teams/${team.id}`)}
                >
                  Go to Team
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You are not part of any teams.</p>
        )}
      </div>
    </>
  );
};
