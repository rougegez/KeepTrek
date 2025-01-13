import React, { createContext, useState } from "react";
import { loginUser, CurrentUser } from "@/APIs/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { access_token } = await loginUser({ email, password });
    localStorage.setItem("token", access_token);
    setUser({ email }); // Set additional user details as needed
  };

  // Fetch user details using token
  const fetchUser = async () => {
    try {
      const userId = await CurrentUser();
      console.log("Fetched user:", userId); // Debug log
      setUser({ id: userId }); // Store user details in state
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout(); // Logout if fetching user fails
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};