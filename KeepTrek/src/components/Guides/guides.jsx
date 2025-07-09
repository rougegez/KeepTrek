"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import MapView from "./map.jsx"
import { Heart, Share2, Clock, MapPin, Bookmark } from "lucide-react"
import TopNavbar from "../topNavBar/TopNavbar.jsx"


const itineraryData = {
  title: "Penang Guide",
  author: {
    name: "Claudia Cheah",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CC",
  },
  date: "Apr 14th, 2025",
  views: 1018,
  description:
    "Just returned from an incredible 4D3N adventure in Penang with the boys! We explored breathtaking heritage sites, indulged in delicious local food, and had our fair share of fun and thrills. From cruising through cultural gems to catching sunsets that words can't do justice to, every day was packed with amazing memories. Sharing our itinerary to give you a glimpse of what Penang has to offer – perfect for your next getaway!",
  heroImage: "/placeholder.svg?height=400&width=800",
  days: [
    {
      day: 1,
      title: "Georgetown Heritage & Culture",
      activities: [
        {
          time: "8:00am",
          duration: "1.5 hr",
          name: "Breakfast @ Cheong Fatt Tze, The Blue Mansion",
          description:
            "Hawker market by the sea. It's between Gurney Bay and Georgetown so perfect location. The place has recently been done up I think so it's quite nice. Hawker market by the sea. It's between Gurney Bay and Georgetown so perfect location. The place has recently been done up I think so it's quite nice.Hawker market by the sea. It's between Gurney Bay and Georgetown so perfect location. The place has recently been done up I think so it's quite nice.Hawker market by the sea. It's between Gurney Bay and Georgetown so perfect location. The place has recently been done up I think so it's quite nice.Hawker market by the sea. It's between Gurney Bay and Georgetown so perfect location. The place has recently been done up I think so it's quite nice.Hawker market by the sea. It's between Gurney Bay and Georgetown so perfect location. The place has recently been done up I think so it's quite nice.",
          image: "/cherating.png",
          coordinates: [5.4164, 100.3327],
          category: "food",
        },
        {
          time: "10:00am",
          duration: "2 hr",
          name: "Pinang Peranakan Mansion",
          description:
            "Opulent 19th-century mansion, now a heritage museum famous for antiques & appearances on TV shows.",
          image: "KeepTrek\src\components\Guides\cherating.png",
          coordinates: [5.4148, 100.3292],
          category: "sights",
        },
        {
          time: "1:00pm",
          duration: "1 hr",
          name: "Lunch @ Cecil Street Food Court",
          description:
            "Hawker market in the wet market. The hawker bit is actually not grimey, stalls shut before 3pm so it's more of a morning thing.",
          image: "/placeholder.svg?height=120&width=160",
          coordinates: [5.4156, 100.3289],
          category: "food",
        },
        {
          time: "3:00pm",
          duration: "2 hr",
          name: "Clan Jetties of Penang",
          description:
            "Busy, scenic destination featuring a traditional village of rustic houses on stilts over the water.",
          image: "/placeholder.svg?height=120&width=160",
          coordinates: [5.4089, 100.3378],
          category: "sights",
        },
      ],
    },
    {
      day: 2,
      title: "Nature & Adventure",
      activities: [
        {
          time: "9:00am",
          duration: "3 hr",
          name: "Penang Botanic Gardens",
          description:
            "If you wanna see wild monkeys and plants :) this is also where you start your hike if you're walking up Penang hill. BRING BUG SPRAY",
          image: "/placeholder.svg?height=180&width=160",
          coordinates: [5.4389, 100.2944],
          category: "nature",
        },
        {
          time: "1:00pm",
          duration: "4 hr",
          name: "Penang Hill",
          description: "Could hike or take the tram. Highest point on the island with slightly lower temperature.",
          image: "/placeholder.svg?height=120&width=160",
          coordinates: [5.4206, 100.2697],
          category: "nature",
        },
      ],
    },
  ],
}

export default function ItineraryView() {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [likeCount, setLikeCount] = useState(30)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const allPlaces = itineraryData.days.flatMap((day) =>
    day.activities.map((activity) => ({ ...activity, day: day.day })),
  )

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <>
    <TopNavbar/>
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Itinerary Details */}
          <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={itineraryData.heroImage || "/placeholder.svg"}
                alt={itineraryData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLike}
                  className={`bg-white/90 backdrop-blur-sm ${isLiked ? "text-red-500" : "text-gray-700"}`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSave}
                  className={`bg-white/90 backdrop-blur-sm ${isSaved ? "text-teal-600" : "text-gray-700"}`}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm text-gray-700">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{itineraryData.title}</h1>
                <div className="flex items-center space-x-3 text-sm mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={itineraryData.author.avatar || "/placeholder.svg"}
                      alt={itineraryData.author.name}
                    />
                    <AvatarFallback className="text-xs">{itineraryData.author.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{itineraryData.author.name}</span>
                </div>
                <div className="text-sm text-white/80">
                  Posted on {itineraryData.date} • {itineraryData.views} views
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-8">{itineraryData.description}</p>

              {/* Days */}
              <div className="space-y-8">
                {itineraryData.days.map((day) => (
                  <div key={day.day}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Day {day.day}</h2>

                    <div className="space-y-4">
                      {day.activities.map((activity, index) => (
                        <div
                          key={index}
                          className={`group flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50 border border-transparent hover:border-gray-200 ${
                            selectedPlace?.name === activity.name
                              ? "bg-teal-50 ring-2 ring-teal-200 border-teal-200"
                              : ""
                          }`}
                          onClick={() => setSelectedPlace(activity)}
                        >
                          {/* Activity Number Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 group-hover:text-teal-600 transition-colors">
                              {index + 1}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 leading-tight">{activity.name}</h3>
                              {/* Time & Duration - Only show if available */}
                              {(activity.time || activity.duration) && (
                                <div className="flex-shrink-0 ml-4">
                                  <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {activity.time && activity.duration
                                        ? `${activity.time} • ${activity.duration}`
                                        : activity.time || activity.duration}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed mb-2">{activity.description}</p>

                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Click to view on map</span>
                            </div>
                          </div>

                          {/* Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.name}
                              className="w-64 h-40 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="bg-gray-100 min-h-screen sticky top-16">
            <MapView places={allPlaces} selectedPlace={selectedPlace} onPlaceSelect={setSelectedPlace} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
