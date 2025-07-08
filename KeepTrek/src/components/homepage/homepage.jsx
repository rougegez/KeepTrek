"use client"
import TopNavbar from "../topNavBar/TopNavbar"
import Hero from "./components/Hero"
import RecentTrips from "./components/RecentTrips"
import Guides from "./components/Guides"
import Stats from "./components/Stats"


export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <Hero />
      <RecentTrips />
      <Guides />
      <Stats />
    </div>
  )
}