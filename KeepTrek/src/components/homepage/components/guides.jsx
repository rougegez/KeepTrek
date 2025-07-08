"use client"
import { motion } from "framer-motion"
import { Heart, Star, MapPin, Clock, Users, Bookmark } from "lucide-react"

const guides = [
  {
    id: 1,
    title: "7 Days in Iceland: Ring Road Adventure",
    author: "Sarah Johnson",
    authorAvatar: "/assets/dummy-image.jpg?height=40&width=40",
    destination: "Iceland",
    duration: "7 days",
    groupSize: "4-6 people",
    rating: 4.9,
    likes: 234,
    saves: 89,
    tags: ["Adventure", "Nature", "Photography"],
    image: "/assets/dummy-image.jpg?height=250&width=400",
    description:
      "Complete guide to exploring Iceland's famous Ring Road with friends, including hidden gems and budget tips.",
    budget: "$1,200 per person",
  },
  {
    id: 2,
    title: "Southeast Asia Backpacking: 3 Weeks",
    author: "Mike Chen",
    authorAvatar: "/assets/dummy-image.jpg?height=40&width=40",
    destination: "Thailand, Vietnam, Cambodia",
    duration: "21 days",
    groupSize: "2-8 people",
    rating: 4.8,
    likes: 456,
    saves: 167,
    tags: ["Backpacking", "Culture", "Budget"],
    image: "/assets/dummy-image.jpg?height=250&width=400",
    description: "Ultimate backpacking route through Southeast Asia with detailed itinerary and local insights.",
    budget: "$800 per person",
  },
  {
    id: 3,
    title: "European Christmas Markets Tour",
    author: "Emma Schmidt",
    authorAvatar: "/assets/dummy-image.jpg?height=40&width=40",
    destination: "Germany, Austria, Czech Republic",
    duration: "10 days",
    groupSize: "3-5 people",
    rating: 4.7,
    likes: 189,
    saves: 78,
    tags: ["Winter", "Culture", "Food"],
    image: "/assets/dummy-image.jpg?height=250&width=400",
    description: "Magical winter journey through Europe's most beautiful Christmas markets with cozy accommodations.",
    budget: "$1,500 per person",
  },
  {
    id: 4,
    title: "Japan Cherry Blossom Festival",
    author: "Yuki Tanaka",
    authorAvatar: "/assets/dummy-image.jpg?height=40&width=40",
    destination: "Tokyo, Kyoto, Osaka",
    duration: "12 days",
    groupSize: "2-6 people",
    rating: 5.0,
    likes: 678,
    saves: 234,
    tags: ["Spring", "Culture", "Photography"],
    image: "/assets/dummy-image.jpg?height=250&width=400",
    description:
      "Perfect timing and locations for experiencing Japan's cherry blossom season with cultural experiences.",
    budget: "$2,000 per person",
  },
  {
    id: 5,
    title: "Costa Rica Adventure & Wildlife",
    author: "Carlos Rodriguez",
    authorAvatar: "/assets/dummy-image.jpg?height=40&width=40",
    destination: "Costa Rica",
    duration: "14 days",
    groupSize: "4-8 people",
    rating: 4.8,
    likes: 312,
    saves: 145,
    tags: ["Adventure", "Wildlife", "Eco-tourism"],
    image: "/assets/dummy-image.jpg?height=250&width=400",
    description: "Comprehensive guide to Costa Rica's national parks, wildlife viewing, and adventure activities.",
    budget: "$1,400 per person",
  },
  {
    id: 6,
    title: "Morocco Desert & Cities Explorer",
    author: "Fatima Al-Zahra",
    authorAvatar: "/assets/dummy-image.jpg?height=40&width=40",
    destination: "Morocco",
    duration: "9 days",
    groupSize: "3-7 people",
    rating: 4.6,
    likes: 267,
    saves: 98,
    tags: ["Desert", "Culture", "Adventure"],
    image: "/assets/dummy-image.jpg?height=250&width=400",
    description: "Journey through Morocco's imperial cities and Sahara Desert with authentic local experiences.",
    budget: "$900 per person",
  },
]

export default function Guides() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Travel Guides</h2>
            <p className="text-gray-600">Discover amazing trips shared by our community</p>
          </motion.div>
          <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent px-4 py-2 rounded-md font-medium transition-colors">
            Browse All Guides
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <img src={guide.image || "/placeholder.svg"} alt={guide.title} className="object-cover w-full h-full absolute inset-0" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm p-2 rounded transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm p-2 rounded transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    {guide.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{guide.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {guide.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="h-4 w-4" />
                      {guide.saves}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{guide.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {guide.destination}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {guide.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {guide.groupSize}
                    </div>
                  </div>
                  <div className="font-medium text-teal-600">{guide.budget}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={guide.authorAvatar || "/placeholder.svg"}
                      alt={guide.author}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-600">by {guide.author}</span>
                  </div>
                  <button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-all">
                    View Guide
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
