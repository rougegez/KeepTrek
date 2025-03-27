// login-form.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthProvider";

export default function LoginForm({ onSwitchToRegister }) {

  const { isLoading, login, googleLogin , error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (error) {
    console.log(error)
  }
  return (
    <Card className="w-full max-w-md mx-auto p-8 border-none shadow-none space-y-6">
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
        onClick={() => googleLogin()}
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
      <form className="space-y-4" onSubmit={(e) =>  {
        e.preventDefault()
        login({ email, password })}}>
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
        {error && <p className="text-red-500 text-sm">{error?.response?.data?.detail[0].ctx?.reason ?? error?.response?.data?.detail ?? error}</p>}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Login"}
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
