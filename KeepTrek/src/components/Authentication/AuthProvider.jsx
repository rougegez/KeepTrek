import React, { createContext, useContext, useState } from "react";
import Modal from "@/components/Authentication/Modal";
import LoginForm from "@/components/Authentication/login/login-form";
import RegisterForm from "@/components/Authentication/register/register-form";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        openLoginModal,
        openRegisterModal,
      }}
    >
      {/* Modals */}
      <Modal isOpen={isLoginModalOpen} onClose={closeModals}>
        <LoginForm onSwitchToRegister={openRegisterModal} />
      </Modal>

      <Modal isOpen={isRegisterModalOpen} onClose={closeModals}>
        <RegisterForm onSwitchToLogin={openLoginModal} />
      </Modal>

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
