import React, { createContext, useState } from "react";
import { loginUser } from "@/APIs/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { access_token } = await loginUser({ email, password });
    localStorage.setItem("token", access_token);
    setUser({ email }); // Set additional user details as needed
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};