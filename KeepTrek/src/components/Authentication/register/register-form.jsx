import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "@/APIs/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Call the backend register endpoint
      const response = await registerUser({ email, username, password });
      alert("Registration successful!");
      navigate("/login"); // Redirect to the login page
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.detail || "Failed to register.");
    }
  };

  return (
    <Card className="w-full max-w-6xl overflow-hidden flex flex-col md:flex-row relative border-none ">
      <div className="w-full md:w-5/12 p-8 bg-white">
        <form className="space-y-6" onSubmit={handleRegister}>
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
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                className="w-full bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            Register
          </Button>
        </form>
        <div className="text-sm text-center mt-4">
          <NavLink to="/login" className="text-sm font-semibold">
            Have an account?
          </NavLink>
        </div>
      </div>
      <div className="relative w-full md:w-7/12 border-transparent">
        <div className="absolute inset-0">
          <img
            src="./src/assets/loginCard.png"
            alt="Yosemite Valley"
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