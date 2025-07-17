"use client"
import { motion } from "framer-motion"
import { MapPin, Users, Calendar, Star } from "lucide-react"

const stats = [
  {
    icon: <MapPin className="h-8 w-8 text-teal-500" />,
    number: "50K+",
    label: "Destinations Explored",
    description: "Across 180+ countries",
  },
  {
    icon: <Users className="h-8 w-8 text-purple-500" />,
    number: "100K+",
    label: "Happy Travelers",
    description: "Planning together",
  },
  {
    icon: <Calendar className="h-8 w-8 text-blue-500" />,
    number: "25K+",
    label: "Trips Organized",
    description: "This year alone",
  },
  {
    icon: <Star className="h-8 w-8 text-yellow-500" />,
    number: "4.9",
    label: "Average Rating",
    description: "From our users",
  },
]

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-500 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-white/90">Thousands of travelers trust KeepTrek for their group adventures</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">{stat.icon}</div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm opacity-80">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
