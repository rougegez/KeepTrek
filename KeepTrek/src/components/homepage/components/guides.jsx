"use client"
import { motion } from "framer-motion"
import { useQuery } from "react-query"
import { getGuides } from "@/APIs/guides.js"
import { useNavigate } from "react-router-dom"
import GuideCard from "@/components/Guides/components/GuideCard"

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
              <GuideCard
                key={guide.id}
                guide={guide}
                self={false}
                />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
