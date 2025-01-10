import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { registerUser } from "@/APIs/auth"; // Ensure this function handles API calls

export default function RegisterForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      await registerUser({ email, username, password }); // Call register API
      alert("Registration successful! Please log in to continue.");
      onSwitchToLogin(); // Switch to the login modal
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 border-none shadow-md space-y-6">
      {/* Logo and Header */}
      <div className="text-center">
        <img
          src="../src/assets/logo.png"
          alt="Logo"
          className="h-16 w-16 mx-auto mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-800">Create an Account</h2>
      </div>

      {/* Social Login (Google) */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-300"
        onClick={() => alert("Sorry, this feature is under development 🥺")}
      >
        <img src="../src/assets/google.png" alt="Google" className="h-5 w-5" />
        Sign up with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or register with email</span>
        </div>
      </div>

      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
        >
          Register
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-teal-500 font-medium"
        >
          Already have an account? Login
        </button>
      </div>
    </Card>
  );
}
