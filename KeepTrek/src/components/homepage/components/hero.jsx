"use client"
import { motion } from "framer-motion"
import { Plus, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-20 pb-20 bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome back to KeepTrek</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your next adventure is just a click away. Plan, organize, and explore with your friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-medium flex items-center justify-center transition-colors"
              onClick={() => navigate('/create-trip')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Trip
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-teal-600 text-lg px-8 py-4 rounded-full bg-transparent font-medium flex items-center justify-center transition-colors">
              <MapPin className="mr-2 h-5 w-5" />
              Explore Destinations
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/4 -left-8 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
      </div>
    </section>
  )
}
