"use client"
import { motion } from "framer-motion"
import { Heart, Star, MapPin, Clock, Users, Bookmark } from "lucide-react"
import { useQuery } from "react-query"
import { getGuides } from "@/APIs/guides.js"
import { useNavigate } from "react-router-dom"

function GuideListLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-gray-200" />
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Guides() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(["homepageGuides"], () => getGuides({ self: false, page: 1, page_size: 6 }), { refetchOnWindowFocus: false });
  const guides = data?.items || [];

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
          <button
            className="border border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent px-4 py-2 rounded-md font-medium transition-colors"
            onClick={() => navigate("/guides")}
          >
            Browse All Guides
          </button>
        </div>

        {isLoading ? (
          <GuideListLoadingSkeleton />
        ) : isError ? (
          <div className="text-center text-red-500 py-12">Failed to load guides. Please try again later.</div>
        ) : guides.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No guides found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/guides/view/${guide.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/guides/view/${guide.id}`) }}
              >
                <div className="relative h-48">
                  <img src={guide.hero_image || "/placeholder.svg"} alt={guide.title} className="object-cover w-full h-full absolute inset-0" />
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
                      {(guide.tags || []).slice(0, 2).map((tag, i) => (
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
                      <span className="text-sm font-medium">{guide.rating || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {guide.likes_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        {guide.saves_count || 0}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{guide.title}</h3>
                  <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {guide.description ? (
                      <span dangerouslySetInnerHTML={{ __html: guide.description }} />
                    ) : (
                      <span className="italic text-gray-400">No description yet</span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {guide.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {guide.duration?.days ? `${guide.duration.days} days` : "-"}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {guide.group_size || "-"}
                      </div>
                    </div>
                    {guide.budget && <div className="font-medium text-teal-600">{guide.budget}</div>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={guide.author_avatar || "/placeholder.svg"}
                        alt={guide.author || "Author"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm text-gray-600">by {guide.author || "Unknown"}</span>
                    </div>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-all"
                      onClick={e => { e.stopPropagation(); navigate(`/guides/view/${guide.id}`) }}
                    >
                      View Guide
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
