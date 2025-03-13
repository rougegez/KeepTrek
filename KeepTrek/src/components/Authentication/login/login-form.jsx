// login-form.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { loginUser } from "@/APIs/auth"; // existing email/password login API
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoginForm({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    try {
      const response = await loginUser({ email, password });
      const { access_token } = response;
      localStorage.setItem("token", access_token);
      if (onLoginSuccess) onLoginSuccess();
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    // URL of your backend endpoint that starts the Google OAuth flow
    const googleLoginUrl = "https://keeptrek-backend.onrender.com/auth/google-login";
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
        localStorage.setItem("token", event.data.token);
        if (onLoginSuccess) onLoginSuccess();
        window.removeEventListener("message", handleMessage);
        if (authWindow) authWindow.close();
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage, false);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 border-none shadow-md space-y-6">
      <div className="text-center">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="h-16 w-16 mx-auto mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-800">Welcome Back!</h2>
      </div>

      {/* Social Login */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-300"
        onClick={handleGoogleLogin}
      >
        <img src="/assets/google.png" alt="Google" className="h-5 w-5" />
        Sign in with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Email and Password Form */}
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? <LoadingSpinner /> : "Login"}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-sm text-teal-500 font-medium"
        >
          Don't have an account? Register
        </button>
      </div>
    </Card>
  );
}
