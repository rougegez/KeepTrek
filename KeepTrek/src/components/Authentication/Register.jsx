// // src/components/Authentication/Register.jsx
// import React, { useState } from "react";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "../../firebaseConfig";
// import "./Modal.css";

// export const Register = ({ closeModal, switchToLogin, onAuthSuccess }) => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       closeModal();
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (username.length < 3) {
//       setErrorMsg("Username must be at least 3 characters long.");
//       return;
//     }

//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(auth.currentUser, {
//         displayName: username,
//       });

//       onAuthSuccess();
//       closeModal();
//     } catch (error) {
//       console.error("Error registering:", error.message);
//       setErrorMsg(error.message);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal">
//         <button className="close-modal" onClick={closeModal}>
//           &times;
//         </button>
//         <h2 className="modal-header">Register</h2>
//         {errorMsg && <p className="error">{errorMsg}</p>}
//         <form onSubmit={handleRegister}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password (6+ characters)"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button className="btn-primary" type="submit">
//             Register
//           </button>
//         </form>
//         <p>
//           Already have an account?{" "}
//           <button className="link-button" onClick={switchToLogin}>
//             Login Here
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };
