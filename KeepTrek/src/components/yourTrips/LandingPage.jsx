import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingImage from "../../assets/LandingImage.png";
import TopNavbar from "../topnavbar/topnavbar.jsx";
import playStore from "../../assets/playstore.svg";
import instagram from "../../assets/insta icon.png";
import facebook from "../../assets/facebook icon.png";
import appStore from "../../assets/App_Store_Icon.png";
import tiktok from "../../assets/tiktok icon.png";
import {
  Calendar,
  Users,
  PieChart,
  Map,
  Search,
  Share2,
  Calculator,
  FileText,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <TopNavbar />

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
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
          </div>
          <div className="relative">
            <img
              src={LandingImage}
              alt="App preview on laptop and mobile"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold">1000</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">200</div>
            <div className="text-sm text-gray-500">Trips Planned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">500</div>
            <div className="text-sm text-gray-500">Groups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-gray-500">Stars</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <Calendar className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Discover locations and activities
                </h3>
                <p className="text-sm text-gray-600">
                  Find the perfect spots for your trip
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <Users className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Arrange and plan your days
                </h3>
                <p className="text-sm text-gray-600">
                  Organize your itinerary efficiently
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <Share2 className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Invite your friends to keep them in the loop
                </h3>
                <p className="text-sm text-gray-600">
                  Share plans with your group
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <Map className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Find dates where everyone is available
                </h3>
                <p className="text-sm text-gray-600">
                  Coordinate schedules easily
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <Search className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Search for the best deals on activities
                </h3>
                <p className="text-sm text-gray-600">
                  Get the best value for your trip
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <PieChart className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Review and vote on plans with your friends
                </h3>
                <p className="text-sm text-gray-600">Make decisions together</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <Calculator className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Split and track shared expenses
                </h3>
                <p className="text-sm text-gray-600">
                  Manage group finances easily
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-none shadow-none bg-gray-50">
            <div className="flex gap-4">
              <FileText className="h-6 w-6 text-teal-500" />
              <div>
                <h3 className="font-semibold mb-2">
                  Keep all necessary info in one place
                </h3>
                <p className="text-sm text-gray-600">
                  Access important details quickly
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-purple-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            Find the plan suits your needs
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* STANDARD */}
            <Card className="p-8 bg-white">
              <h3 className="text-xl font-bold mb-6">Standard</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Integrated Maps</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Save Locations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Save Notes and Files</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Browse for best deals</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Invite up to 4 friends</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Trip Date Finder</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Location Voting</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Expense Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>AI Travel Planning Assistant (4 uses/day)</span>
                </li>
              </ul>
              <div className="text-3xl font-bold mb-6">0.00$</div>
              <Button className="w-full bg-teal-500 hover:bg-teal-600">
                Get Started
              </Button>
            </Card>

            {/* PREMIUM */}
            <Card className="p-8 bg-white">
              <h3 className="text-xl font-bold mb-6">Premium</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Everything in Free Tier plus...</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Invite up to 12 friends</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>2x larger files and 4x the file limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>10x Usage of AI Assistant</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Route Optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span>Itinerary Maximizer</span>
                </li>
              </ul>
              <div className="text-3xl font-bold">20.00$</div>
              <div className="text-xs text-gray-600 mb-6">per month</div>
              <Button className="w-full bg-teal-500 hover:bg-teal-600">
                Get Started
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-600 rounded-2xl p-8 flex justify-between items-start">
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
                <button className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium">
                  Sign Up
                </button>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="flex items-start gap-8">
                {/* A container for "or" */}
                <div className="relative" style={{ marginTop: "5rem" }}>
                  <span
                    className="block text-center text-white text-5xl font-bold"
                    style={{ position: "absolute", left: "-3cm" }}
                  >
                    or
                  </span>
                </div>

                {/* Buttons stay exactly where they are */}
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-black text-white rounded-lg flex items-center justify-start hover:bg-gray-900">
                    <img
                      src={playStore}
                      alt="Google Play"
                      className="h-5 w-5 mr-2"
                    />
                    <span className="text-sm">Google Play</span>
                  </button>
                  <button className="w-full px-4 py-2 bg-black text-white rounded-lg flex items-center justify-start hover:bg-gray-900">
                    <img
                      src={appStore}
                      alt="App Store"
                      className="h-5 w-5 mr-2"
                    />
                    <span className="text-sm">App Store</span>
                  </button>
                  <button className="w-full px-4 py-2 bg-white text-black rounded-lg flex items-center justify-start hover:bg-gray-100">
                    <img
                      src={instagram}
                      alt="Instagram"
                      className="h-5 w-5 mr-2"
                    />
                    <span className="text-sm">@keeptrek</span>
                  </button>
                  <button className="w-full px-4 py-2 bg-white text-black rounded-lg flex items-center justify-start hover:bg-gray-100">
                    <img src={tiktok} alt="TikTok" className="h-5 w-5 mr-2" />
                    <span className="text-sm">@keeptrek</span>
                  </button>
                  <button className="w-full px-4 py-2 bg-white text-black rounded-lg flex items-center justify-start hover:bg-gray-100">
                    <img
                      src={facebook}
                      alt="Facebook"
                      className="h-5 w-5 mr-2"
                    />
                    <span className="text-sm">KeepTrek</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
