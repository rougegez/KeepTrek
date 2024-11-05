// src/components/Budget/JoinTeam.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import "./JoinTeam.css";

export const JoinTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        checkTeam(user);
      } else {
        setError("Please log in to join a team");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [teamId]);

  const checkTeam = async (user) => {
    try {
      // Get team document
      const teamRef = doc(firestore, "teams", teamId);
      const teamDoc = await getDoc(teamRef);

      if (!teamDoc.exists()) {
        setError("Invalid team invitation link");
        setLoading(false);
        return;
      }

      const team = teamDoc.data();

      // Check if user is already in team
      if (team.members.includes(user.uid)) {
        setError("You are already a member of this team");
        setJoined(true);
        setLoading(false);
        return;
      }

      // Get team name
      setTeamName(team.name || "Unnamed Team");

      // Get team owner's name
      const ownerRef = doc(firestore, "users", team.owner);
      const ownerDoc = await getDoc(ownerRef);
      if (ownerDoc.exists()) {
        const ownerData = ownerDoc.data();
        setOwnerName(ownerData.displayName || ownerData.email || "Team Owner");
      } else {
        setOwnerName("Team Owner");
      }

      setTeamData(team);
      setLoading(false);
    } catch (error) {
      console.error("Error checking team:", error);
      setError("Failed to load team information");
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    try {
      setLoading(true);

      // Update team members array
      const teamRef = doc(firestore, "teams", teamId);
      await updateDoc(teamRef, {
        members: arrayUnion(currentUser.uid),
      });

      // Add user's information to the users collection if not already present
      const userRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: currentUser.email,
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
          createdAt: new Date(),
        });
      }

      setJoined(true);
      setLoading(false);
    } catch (error) {
      console.error("Error joining team:", error);
      setError("Failed to join team. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="join-team-container">
        <div className="join-team-card">
          <div className="loading-spinner"></div>
          <p>Loading team information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="join-team-container">
        <div className="join-team-card error">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="budget-btn-primary"
            onClick={() => navigate("/expense-splitting")}
          >
            Go to Budget Page
          </button>
        </div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="join-team-container">
        <div className="join-team-card success">
          <h2>Success!</h2>
          <p>
            You have successfully joined the team <strong>{teamName}</strong>.
          </p>
          <button
            className="budget-btn-primary"
            onClick={() => navigate("/expense-splitting")}
          >
            Go to Budget Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-team-container">
      <div className="join-team-card">
        <h2>Team Invitation</h2>
        <p>
          You have been invited to join the team <strong>{teamName}</strong>{" "}
          created by {ownerName}.
        </p>
        <div className="join-team-actions">
          <button
            className="budget-btn-primary"
            onClick={handleJoinTeam}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Team"}
          </button>
          <button
            className="budget-btn-secondary"
            onClick={() => navigate("/expense-splitting")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
