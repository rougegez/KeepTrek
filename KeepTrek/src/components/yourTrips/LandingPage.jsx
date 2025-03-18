import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingImage from "/assets/LandingImage.png";
import TopNavbar from "../topNavBar/TopNavbar";
import playStore from "/assets/playstore.svg";
import instagram from "/assets/insta icon.png";
import facebook from "/assets/facebook icon.png";
import appStore from "/assets/App_Store_Icon.png";
import tiktok from "/assets/tiktok icon.png";
import { Calendar, Users, PieChart, Map, Search, Share2, Calculator, FileText, Rocket, Sparkles, Bell } from 'lucide-react';
import { useAuth } from "@/contexts/AuthProvider";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.3 } },
};

const AnimatedSection = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={staggerChildren}>
      {children}
    </motion.div>
  );
};

export default function LandingPage() {

  // Use a string to track which button's popup is active (or null)
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);
  const {isAuthLoaded} = useAuth();

  // Handle clicks on buttons that are "unavailable"
  const handleUnavailableClick = (id, e) => {
    e.preventDefault();
    setActivePopup(id);
    setTimeout(() => {
      setActivePopup(null);
    }, 3000);
  };

  // Hide popup if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

if (!isAuthLoaded) {
    return null;
}

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <TopNavbar />

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simplifying
                <br />
                Group Trips
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                All-in-one trip itinerary planner for
                <br />
                groups and individuals.
              </p>
              <Link to="/create-trip">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                  Get Started
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src={LandingImage} alt="App preview on laptop and mobile" className="w-full" />
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-12">Key Features</h2>
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Discover locations and activities",
                description: "Find the perfect spots for your trip",
              },
              {
                icon: Users,
                title: "Arrange and plan your days",
                description: "Organize your itinerary efficiently",
              },
              {
                icon: Share2,
                title: "Invite your friends to keep them in the loop",
                description: "Share plans with your group",
              },
              {
                icon: Map,
                title: "Find dates where everyone is available",
                description: "Coordinate schedules easily",
              },
              {
                icon: Search,
                title: "Search for the best deals on activities",
                description: "Get the best value for your trip",
              },
              {
                icon: PieChart,
                title: "Review and vote on plans with your friends",
                description: "Make decisions together",
              },
              {
                icon: Calculator,
                title: "Split and track shared expenses",
                description: "Manage group finances easily",
              },
              {
                icon: FileText,
                title: "Keep all necessary info in one place",
                description: "Access important details quickly",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 border-none shadow-none bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                  <div className="flex gap-4">
                    <feature.icon className="h-6 w-6 text-teal-500" />
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Pre-Launch Announcement Section */}
      <section id="pre-launch" className="bg-purple-50 py-16">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.h2 className="text-3xl font-bold text-center mb-12" variants={fadeInUp}>
              Exciting Things Are Coming!
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-white hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <Rocket className="h-12 w-12 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-center">KeepTrek is Launching Soon!</h3>
                    <p className="text-gray-600 text-center mb-6">
                      Get ready for a revolutionary way to plan and manage your group trips. 
                      KeepTrek is about to change the way you travel with friends and family.
                    </p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      "All-in-one trip planning",
                      "Collaborative itineraries",
                      "Smart expense splitting",
                      "AI-powered travel suggestions",
                      "And much more!",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <Bell className="h-12 w-12 text-yellow-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-center">Be the First to Know</h3>
                    <p className="text-center mb-6">
                      Sign up now to get exclusive early access and special launch offers. 
                      Don't miss out on the future of group travel planning!
                    </p>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg text-gray-900"
                    />
                    {/* Waitlist Button wrapped in a relative container */}
                    <div className="relative">
                      <Button
                        onClick={(e) => handleUnavailableClick("waitlist", e)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-colors duration-300"
                      >
                        Join the Waitlist
                      </Button>
                      {activePopup === "waitlist" && (
                        <div
                          ref={popupRef}
                          className="absolute top-full mt-2 bg-white shadow-lg p-3 rounded-md w-56 z-10 border border-gray-200"
                        >
                          <span className="text-sm text-gray-700">
                            🚧 We are working on it! Stay tuned. 🚀
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-center text-gray-200">
                      By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
          <motion.div className="bg-purple-600 rounded-2xl p-4 sm:p-8 flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-8" variants={fadeInUp}>
          {/* Left side - Newsletter signup */}
          <div className="space-y-4 w-full lg:w-2/3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-md text-center lg:text-left">
              Still looking for where to head to next?
            </h2>
            <p className="text-lg sm:text-xl text-white font-medium text-center lg:text-left">
              Join our newsletter now!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-lg text-gray-900 w-[81%] sm:min-w-[280px]"
              />
              {/* Newsletter Sign Up Button */}
              <div className="relative inline-block w-[83%] sm:w-auto">
                <button
                  onClick={(e) => handleUnavailableClick("newsletterSignUp", e)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors duration-300"
                >
                  Sign Up
                </button>
                {activePopup === "newsletterSignUp" && (
                  <div
                    ref={popupRef}
                    className="absolute top-full mt-2 bg-white shadow-lg p-3 rounded-md w-56 z-10 border border-gray-200"
                  >
                    <span className="text-sm text-gray-700">
                      🚧 We are working on it! Stay tuned. 🚀
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Social links */}
          <div className="flex flex-col items-center lg:w-1/3 space-y-4">
            <div className="space-y-2 relative w-full sm:w-auto max-w-[280px]">
              {[
                { icon: instagram, label: "@keeptrek", bg: "bg-white", href: "https://www.instagram.com/keeptrek/" },
                { icon: tiktok, label: "@keeptrek", bg: "bg-white", href: "https://www.tiktok.com/@keep_trek?_t=ZS-8u4xDfEz7YY&_r=1" },
                { icon: facebook, label: "KeepTrek", bg: "bg-white", href: "https://www.facebook.com/profile.php?id=61573568121293" },
              ].map((button, index) => (
                <div key={index} className="relative w-full">
                  <a href={button.href} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <motion.button
                      className="w-[280px] lg:w-[250px] h-16 px-4 py-2 bg-white text-black rounded-lg flex flex-col items-center justify-center hover:opacity-85 transition-opacity duration-300 text-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={button.icon} alt={button.label} className="h-6 w-6 mb-1" />
                      <span className="text-center font-semibold">{button.label}</span>
                    </motion.button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}