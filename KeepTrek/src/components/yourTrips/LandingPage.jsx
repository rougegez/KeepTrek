import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingImage from "/assets/LandingImage.png";
import heroBG from "/assets/heroBG.png";
import TopNavbar from "../topNavBar/TopNavbar";
import playStore from "/assets/playstore.svg";
import instagram from "/assets/insta icon.png";
import facebook from "/assets/facebook icon.png";
import appStore from "/assets/App_Store_Icon.png";
import tiktok from "/assets/tiktok icon.png";
import { Calendar, Users, PieChart, Map, Search, Share2, Calculator, FileText, Rocket, Sparkles, Bell, Globe, Clock, DollarSign, Vote, ChevronDown, Zap, MapPin } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const slideIn = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const AnimatedSection = ({ children, delay = 0, threshold = 0.2 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  return (
    <motion.div 
      ref={ref} 
      initial="hidden" 
      animate={inView ? "visible" : "hidden"} 
      variants={staggerChildren}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// Scroll to section function simplified
const ScrollToNextSection = ({ targetId }) => {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      onClick={handleClick}
    >
      <ChevronDown className="h-8 w-8 text-white bg-teal-500 rounded-full p-1.5" />
    </motion.div>
  );
};

export default function LandingPage() {
  // Use a string to track which button's popup is active (or null)
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax and scroll effects
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const heroY = useTransform(scrollY, [0, 300], [0, 50]);
  
  // Scroll indicator visibility
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const features = [
    {
      icon: Users,
      title: "Collaborative Planning",
      description: "Create and edit trip plans together in real-time",
    },
    {
      icon: Calendar,
      title: "Group Date Finder",
      description: "Find dates when everyone is available",
    },
    {
      icon: DollarSign,
      title: "Split Expenses Easily",
      description: "Track costs and split bills automatically",
    },
    {
      icon: Map,
      title: "Map Integration",
      description: "See all activities on an interactive map",
    },
    {
      icon: Clock,
      title: "Day-by-Day Itinerary",
      description: "Organize activities with times and locations",
    },
    {
      icon: Vote,
      title: "Vote on Activities",
      description: "Democratically decide what to do as a group",
    },
    {
      icon: Globe,
      title: "Real-time Updates",
      description: "See changes instantly across all devices",
    },
    {
      icon: PieChart,
      title: "Expense Analytics",
      description: "Visualize spending patterns during your trip",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden snap-y snap-mandatory">
      {/* Fixed navbar wrapper */}
  <div className="fixed top-0 left-0 right-0 z-50">
    <TopNavbar className="bg-white shadow-sm" />
  </div>

      {/* Hero Section */}

<section ref={heroRef} id="home" className="relative h-screen flex items-center overflow-hidden snap-start bg-hero pt-16" // Add a class for background
  style={{ 
    backgroundImage: window.innerWidth > 768 ? "url('/assets/heroBG.png')" : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
  <motion.div 
    className="absolute inset-0"
    style={{ opacity: heroOpacity }}
  />
  
  <motion.div 
    className="container px-6 mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12"
    style={{ scale: heroScale, y: heroY }}
  >
    {/* Text Content - Left Side */}
    <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
    <motion.div 
        className="inline-block mb-4 lg:mb-6 overflow-hidden rounded-2xl"
        variants={scaleUp}
      >
        <span className="inline-block bg-[#4cb6ac] text-white px-3 py-1 lg:px-4 lg:py-2 rounded-3xl text-xs lg:text-sm font-medium">
          Plan . Collaborate . Travel.
        </span>
      </motion.div>
      
      <motion.h1 
        className="text-4xl lg:text-7xl font-bold mb-4 lg:mb-6 leading-tight text-[#383838] font-league-spartan"
        variants={fadeInUp}
      >
        Get your trips<br />
        out of the<br />
        <span className="text-[#4cb6ac]">Group Chat</span>
      </motion.h1>
      
      <motion.p 
        className="text-[#383838] text-sm sm:text-lg lg:text-xl mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0 px-14 sm:px-0"
        variants={fadeInUp}
      >
        Everything your group needs to plan and manage a trip, <br/>without the hassle.
      </motion.p>
      
      <motion.div
  initial={{ scale: 0.95 }}
  animate={{ scale: 1 }}
  transition={{ 
    repeat: Infinity,
    repeatType: "reverse",
    duration: 2
  }}
>      <Link to="/yourTrips">
  <Button 
    size="lg" 
    className="relative overflow-hidden group bg-gradient-to-r from-teal-400 to-teal-500 text-white text-lg px-10 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-medium hover:from-teal-500 hover:to-teal-700 w-full sm:w-auto"
  >
    {/* Animated background effect */}
    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    
    {/* Button content with animation */}
    <motion.span 
      className="relative z-10 flex items-center justify-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Start Planning
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Rocket className="h-5 w-5" />
      </motion.span>
    </motion.span>
    
    {/* Glow effect */}
    <span className="absolute inset-0 rounded-2xl shadow-[0_0_15px_rgba(76,182,172,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
  </Button>
</Link>
        
      </motion.div>
    </div>
    
    {/* Image - Right Side */}
    <motion.div
      className="lg:w-1/2 flex justify-center items-center"
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="w-full max-w-2xl" // Increased max-width
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <img 
          src={LandingImage} 
          alt="KeepTrek app preview" 
          className="w-full h-auto object-contain" // Ensures proper scaling

        />
      </motion.div>
    </motion.div>
  </motion.div>
  
  {showScrollIndicator && <ScrollToNextSection targetId="features" />}
</section>

      {/* Features Section */}
      <section id="features" className="py-28 snap-start bg-white relative">
        <div className="container mx-auto px-6">
          <AnimatedSection threshold={0.3}>
            <motion.div variants={fadeInUp} className="text-center mb-20">
              <motion.span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Features
              </motion.span>
              <h2 className="text-3xl md:text-3xl font-bold mb-6">From schedules to spending, <br/>organize every part of your group trip.</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                KeepTrek simplifies group trip planning with powerful, intuitive tools
              </p>
            </motion.div>
          
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
        </div>
        <ScrollToNextSection targetId="why-keeptrek" />
      </section>

      {/* Why KeepTrek Section - Vertical timeline with parallax effect */}
      <section id="why-keeptrek" className="bg-white py-16 sm:py-20 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 lg:mb-20">
            <motion.h2 
              className="text-4xl font-bold mb-6" 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              Why <span className="text-teal-500">KeepTrek</span>?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              Get your trips out of the groupchat and transform them into reality
            </motion.p>
          </div>

          {/* Vertical timeline with content on alternating sides */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-400 to-purple-500 z-0 rounded-full"></div>

            {[
              {
                title: "The Problem",
                description: "Trip planning is chaotic. Messages get lost in group chats, plans fall through the cracks, and great trips never happen.",
                icon: <Share2 className="h-8 w-8 text-white" />,
                color: "from-red-400 to-red-600",
                side: "left"
              },
              {
                title: "The Solution",
                description: "KeepTrek brings everyone together in one place where you can plan, organize, and coordinate your entire trip seamlessly.",
                icon: <Zap className="h-8 w-8 text-white" />,
                color: "from-teal-400 to-teal-600", 
                side: "right"
              },
              {
                title: "Real-time Collaboration",
                description: "Everyone sees changes instantly. No more waiting for updates or wondering if plans have changed.",
                icon: <Users className="h-8 w-8 text-white" />,
                color: "from-blue-400 to-blue-600",
                side: "left"
              },
              {
                title: "Everything In One Place",
                description: "Itineraries, expenses, maps, and schedules — all your trip details organized in a single, easy-to-use platform.",
                icon: <MapPin className="h-8 w-8 text-white" />,
                color: "from-purple-400 to-purple-600",
                side: "right"
              },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`flex items-center mb-20 ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'} relative z-10`}
                initial={{ opacity: 0, x: item.side === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Content */}
                <div className={`w-5/12 ${item.side === 'left' ? 'text-center sm:text-right pr-0 sm:pr-12 pl-0 sm:pl-52' : 'text-center sm:text-left pl-2 sm:pl-12 pr-0 sm:pr-52'}`}>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>

                {/* Center circle */}
                <div className="w-2/12 flex justify-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    {item.icon}
                  </div>
                </div>

                {/* Empty space or image */}
                <div className="w-5/12">
                  {index % 2 === 0 && (
                    <motion.div 
                      className={`${item.side === 'right' ? 'pr-12' : 'pl-12'} opacity-0 sm:opacity-100`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <div className={`h-[140px] w-[140px] rounded-2xl bg-gradient-to-br ${item.color} opacity-10 mx-auto transform rotate-12`}></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full filter blur-3xl opacity-30"></div>
        <ScrollToNextSection targetId="newsletter" />
      </section>


      {/* How It Works Section
      <section id="how-it-works" className="py-28 snap-start bg-gradient-to-b from-white to-gray-50 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection threshold={0.3}>
            <motion.div variants={fadeInUp} className="text-center mb-20">
              <motion.span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Simple Process
              </motion.span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">How KeepTrek Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Three simple steps to make your group trips a reality
              </p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection threshold={0.2}>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Create a Trip",
                  description: "Start a new trip and invite your friends to join the planning process",
                  icon: Rocket,
                  color: "from-teal-400 to-teal-500"
                },
                {
                  step: "02",
                  title: "Plan Together",
                  description: "Collaborate on dates, places, and activities in real-time",
                  icon: Users,
                  color: "from-teal-400 to-teal-500"
                },
                {
                  step: "03",
                  title: "Enjoy & Split Costs",
                  description: "Track expenses and split costs automatically during your trip",
                  icon: DollarSign,
                  color: "from-teal-400 to-teal-500"
                },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center relative"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`w-full h-[1px] absolute top-10 left-1/2 bg-gradient-to-r ${item.color} ${index === 2 ? 'hidden' : 'hidden md:block'}`} style={{ width: '100%' }}></div>
                  <div className={`bg-gradient-to-r ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold mb-8 text-white shadow-lg`}>
                    {item.step}
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 w-full">
                    <item.icon className="h-10 w-10 text-gray-700 mb-4 mx-auto" />
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
        
        <ScrollToNextSection targetId="pre-launch" />
      </section> */}

    
      {/* Newsletter Section */}
      <section id="newsletter" className="py-28 snap-start bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <motion.div 
                className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-3xl p-12 flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-10" 
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                {/* Left side - Newsletter signup */}
                <div className="space-y-4 w-full lg:w-2/3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-md text-center lg:text-left">
                    Still looking for where to head to next?
                  </h2>
                  <p className="text-xl sm:text-2xl text-white font-medium text-center lg:text-left">
                    Join our newsletter now!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="px-5 py-3.5 rounded-xl text-gray-900 w-full sm:min-w-[300px] focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    {/* Newsletter Sign Up Button */}
                    <div className="relative inline-block w-full sm:w-auto">
                      <button
                        onClick={(e) => handleUnavailableClick("newsletterSignUp", e)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-gray-100 text-teal-700 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Sign Up
                      </button>
                      {activePopup === "newsletterSignUp" && (
                        <div
                          ref={popupRef}
                          className="absolute top-full mt-4 bg-white shadow-lg p-4 rounded-xl z-10 border border-gray-100"
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
                <div className="flex flex-col items-center lg:items-end lg:w-1/3 space-y-4">
                  <div className="space-y-3 relative w-full sm:w-auto max-w-[280px]">
                    {[
                      { icon: instagram, label: "@keeptrek", bg: "bg-white", href: "https://www.instagram.com/keeptrek/" },
                      { icon: tiktok, label: "@keeptrek", bg: "bg-white", href: "https://www.tiktok.com/@keep_trek?_t=ZS-8u4xDfEz7YY&_r=1" },
                      { icon: facebook, label: "KeepTrek", bg: "bg-white", href: "https://www.facebook.com/profile.php?id=61573568121293" },
                    ].map((button, index) => (
                      <div key={index} className="relative w-full">
                        <a href={button.href} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <motion.button
                            className="w-full lg:w-[250px] h-16 px-4 py-2 bg-white text-black rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 text-center shadow-md hover:shadow-lg gap-3"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img src={button.icon} alt={button.label} className="h-6 w-6" />
                            <span className="text-center font-medium">{button.label}</span>
                          </motion.button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16 mt-0">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">KeepTrek</h3>
              <p className="text-gray-600">© {new Date().getFullYear()} KeepTrek. All rights reserved.</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
