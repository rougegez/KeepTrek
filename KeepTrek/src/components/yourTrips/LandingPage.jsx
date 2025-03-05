import React from "react";
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
import appStore from "./assets/App_Store_Icon.png";
import tiktok from "/assets/tiktok icon.png";
import { Calendar, Users, PieChart, Map, Search, Share2, Calculator, FileText, Rocket, Sparkles, Bell } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.3} },
};

const AnimatedSection = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerChildren}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
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
              <img
                src={LandingImage}
                alt="App preview on laptop and mobile"
                className="w-full"
              />
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Metrics Section
      <section className="container mx-auto px-6 py-12">
        <AnimatedSection>
          <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "1000", label: "Active Users" },
              { value: "200", label: "Trips Planned" },
              { value: "500", label: "Groups" },
              { value: "5", label: "Stars" },
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <motion.div
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section> */}

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
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
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
            <motion.h2 
              className="text-3xl font-bold text-center mb-12"
              variants={fadeInUp}
            >
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
                      "And much more!"
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
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-colors duration-300">
                      Join the Waitlist
                    </Button>
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
      <section id="newsletter" className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <motion.div
              className="bg-purple-600 rounded-2xl p-8 flex justify-between items-start"
              variants={fadeInUp}
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white max-w-md">
                  Still looking for where to head to next?
                </h2>
                <p className="text-xl text-white font-medium">
                  Join our newsletter now!
                </p>
                <div className="flex gap-3 items-center">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2.5 rounded-lg text-gray-900 min-w-[280px]"
                  />
                  <button className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors duration-300">
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <div className="flex items-start gap-8">
                  <div className="relative" style={{ marginTop: "5rem" }}>
                    <span
                      className="block text-center text-white text-5xl font-bold"
                      style={{ position: "absolute", left: "-3cm" }}
                    >
                      or
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { icon: playStore, label: "Google Play", bg: "bg-black" },
                      { icon: appStore, label: "App Store", bg: "bg-black" },
                      { icon: instagram, label: "@keeptrek", bg: "bg-white" },
                      { icon: tiktok, label: "@keeptrek", bg: "bg-white" },
                      { icon: facebook, label: "KeepTrek", bg: "bg-white" },
                    ].map((button, index) => (
                      <motion.button
                        key={index}
                        className={`w-full px-4 py-2 ${button.bg} ${
                          button.bg === "bg-black" ? "text-white" : "text-black"
                        } rounded-lg flex items-center justify-start hover:opacity-80 transition-opacity duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={button.icon}
                          alt={button.label}
                          className="h-5 w-5 mr-2"
                        />
                        <span className="text-sm">{button.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}