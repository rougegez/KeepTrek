import LoginForm from "./login-form";
import React from "react";


export default function Login() {
  return (
    <div 
      className="min-h-screen w-full bg-white relative flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('./src/assets/login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for background */}
      <div className="absolute inset-0 bg-black/60" />
      <LoginForm />
    </div>
  )
}

