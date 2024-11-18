// src/components/Budget/BudgetPage.jsx
import React, { useEffect, useState } from "react";
// import { auth, firestore } from "../../firebaseConfig"; // Import 'firestore'
// import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import KeepTrek from "../../assets/KeepTrek.png";
// import { Login } from "../Authentication/Login.jsx";
// import { Register } from "../Authentication/Register.jsx";
import "./BudgetPage.css";
import TeamNameModal from "./TeamNameModal.jsx";

export const BudgetPage = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setShowLoginModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const openTeamNameModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveTeamName = async (name) => {
    setIsModalOpen(false);

    try {
      // Generate a new team document with a unique ID
      const teamsCollectionRef = collection(firestore, "teams");
      const teamDocRef = await addDoc(teamsCollectionRef, {
        owner: user.uid,
        members: [user.uid],
        name: name,
        createdAt: new Date(),
      });
      const newTeamId = teamDocRef.id;

      // Store the team ID in the user's profile
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(
        userRef,
        {
          currentTeamId: newTeamId,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
        },
        { merge: true }
      );

      // Navigate to the team's budget page
      navigate(`/teams/${newTeamId}`);
    } catch (error) {
      console.error("Error generating team link:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setUser(auth.currentUser);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    navigate("/");
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
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="budget-page">
        <h2>Welcome to the Budget Management Page</h2>
        <div className="budget-actions">
          <button className="budget-btn-primary" onClick={openTeamNameModal}>
            Create Team
          </button>
          <button
            className="budget-btn-secondary"
            onClick={() => navigate("/team-history")}
          >
            Team History
          </button>
        </div>
      </div>

      {/* Render the modal */}
      <TeamNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeamName}
      />

      {showLoginModal && (
        <Login
          closeModal={handleCloseModal}
          switchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showRegisterModal && (
        <Register
          closeModal={handleCloseModal}
          switchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};
