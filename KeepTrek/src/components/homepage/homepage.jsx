"use client"
import TopNavbar from "../topNavBar/TopNavbar"
import Hero from "./components/hero.jsx"
import RecentTrips from "./components/recentTrips.jsx"
import Guides from "./components/guides.jsx"
import Stats from "./components/stats.jsx"


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