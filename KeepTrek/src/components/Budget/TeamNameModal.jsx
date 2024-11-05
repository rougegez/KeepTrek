// src/components/Budget/TeamNameModal.jsx
import React, { useState } from "react";
import "./TeamNameModal.css";

const TeamNameModal = ({ isOpen, onClose, onSave }) => {
  const [teamName, setTeamName] = useState("");

  const handleSave = () => {
    if (teamName.trim() === "") {
      alert("Please enter a team name.");
      return;
    }
    onSave(teamName.trim());
    setTeamName("");
  };

  const handleClose = () => {
    setTeamName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Name Your Team</h2>
        <input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="modal-btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="modal-btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamNameModal;
