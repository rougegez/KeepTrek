// src/components/Authentication/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import "./Modal.css";

export const Login = ({ closeModal, switchToRegister, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess(); // Notify parent component
    } catch (error) {
      console.error("Error logging in:", error.message);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <button className="close-modal" onClick={closeModal}>
          &times;
        </button>
        <h2>Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <button className="link-button" onClick={switchToRegister}>
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};
