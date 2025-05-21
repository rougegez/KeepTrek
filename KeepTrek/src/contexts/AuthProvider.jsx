import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Modal from "@/components/Authentication/Modal";
import LoginForm from "@/components/Authentication/login/login-form";
import RegisterForm from "@/components/Authentication/register/register-form";
import { CurrentUser, registerUser, loginUser } from "@/APIs/auth";
import { toast } from "sonner"
import { PageLoader } from "@/components/ui/pageLoader";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isAuthLoaded, setAuthLoaded] = useState(false);
  const [{ user, token, isLoggedIn, response, error }, setState] = useState({ user: null, token: null, isLoggedIn: false, response: null, error: null });

  const checkStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await CurrentUser();
        setState((prev) => ({ ...prev, token: token, user: response, isLoggedIn: true, response: response, error: null }));
      } catch (err) {
        // MAYBE : token expired or invalid, handle accordingly
        if (err?.response) {
          setState((prev) => ({ ...prev, token: null, user: null, isLoggedIn: false, error: err }));
          localStorage.removeItem("token");
        } else[
          setState((prev) => ({ ...prev, error: "Something went wrong" }))
        ]
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    checkStatus().finally(() => {
      setLoading(false)
      setAuthLoaded(true);
    });
  }, []);

  const googleLogin = useCallback(() => {
    // URL of your backend endpoint that starts the Google OAuth flow
    const googleLoginUrl = "https://keeptrek-backend.onrender.com/auth/google-login"; //http://localhost:8000/auth/google-login https://keeptrek-backend.onrender.com/auth/google-login
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const authWindow = window.open(
      googleLoginUrl,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Listen for the token message from the popup window
    const handleMessage = (event) => {
      // Optionally verify event.origin for security (ensure it comes from your backend)
      if (event.data && event.data.token) {
        setState((prev) => ({ ...prev, token: event.data.token, isLoggedIn: true, error: null }));
        localStorage.setItem("token", event.data.token);
        checkStatus();
        closeModals();
        if (onLoginSuccess) onLoginSuccess();
        window.removeEventListener("message", handleMessage);
        if (authWindow) authWindow.close();
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage, false);
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData)
      setState((prev) => ({ ...prev, user: response["userID"], isLoggedIn: false, response: response, error: null }))
      toast.success("Account created successfully", { description: <p>Please login to continue</p> })
      openLoginModal();
    } catch (err) {
      if (err?.response) {
        setState((prev) => ({ ...prev, error: err }));
      } else {
        setState((prev) => ({ ...prev, error: "Something went wrong" }));
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await loginUser(userData)
      setState((prev) => ({ ...prev, token: response["access_token"], isLoggedIn: true, error: null }));
      localStorage.setItem("token", response["access_token"]);
      checkStatus();
      closeModals();
      toast.success("Logged in successfully")
    } catch (err) {
      if (err?.response) {
        setState((prev) => ({ ...prev, error: err }));
      } else {
        setState((prev) => ({ ...prev, error: "Something went wrong" }));
      }
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setLoading(true);
    setState((prev) => ({ ...prev, token: null, user: null, isLoggedIn: false, error: null }));
    localStorage.removeItem("token");
    // MAYBE : management of authentication in backend which requires communication
    setLoading(false);
    toast.info("Logged out successfully")
  }, []);

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

  if (isAuthLoaded) {
    return (
      <AuthContext.Provider
        value={{
          user,
          token,
          isLoggedIn,
          response,
          error,
          isLoading,
          isAuthLoaded,
          register,
          googleLogin,
          login,
          logout,
          openLoginModal,
          openRegisterModal,
        }}
      >
        {children}

        {/* Modals */}
        <Modal isOpen={isLoginModalOpen} onClose={closeModals}>
          <LoginForm onSwitchToRegister={openRegisterModal} />
        </Modal>

        <Modal isOpen={isRegisterModalOpen} onClose={closeModals}>
          <RegisterForm onSwitchToLogin={openLoginModal} />
        </Modal>

      </AuthContext.Provider>
    );
  } else {
    return <PageLoader />;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

