import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "@/APIs/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      console.log("Login Response:", response); // Log the entire response
      const { access_token } = response;
      console.log("Access Token:", access_token); // Log the token specifically
  
      localStorage.setItem("token", access_token); // Store token
      alert("Login successful!");
      navigate("/yourTrips"); // Redirect to the homepage
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message); // Log error details
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <Card className="w-full max-w-6xl overflow-hidden flex flex-col md:flex-row relative border-none">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-5/12 p-8 bg-white">
        <div className="space-y-6">
          {/* Social Login Buttons */}
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => {}}
          >
            <img src="./src/assets/dummy-image.jpg" alt="Google" width={20} height={20} />
            Sign up with Google
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => {}}
          >
            <img src="./src/assets/dummy-image.jpg" alt="Microsoft" width={20} height={20} />
            Sign up with Microsoft
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => {}}
          >
            <img src="./src/assets/dummy-image.jpg" alt="Apple" width={20} height={20} />
            Sign up with Apple
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or sign in with email</span>
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleLogin} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            Login
          </Button>

          <div className="text-sm text-center">
            <NavLink to="/register" className="text-sm font-semibold">
              Don't have an account? Register
            </NavLink>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="relative w-full md:w-7/12 border-transparent">
        <div className="absolute inset-0">
          <img
            src="./src/assets/loginCard.png"
            alt="Login Hero"
            width={800}
            height={1000}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </Card>
  );
}