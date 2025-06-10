"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

const categoryColors = {
  sights: "bg-blue-500",
  nature: "bg-green-500",
  food: "bg-orange-500",
  activities: "bg-purple-500",
}

export default function MapView({ places, selectedPlace, onPlaceSelect }) {
  const mapRef = useRef(null)
  const [hoveredPlace, setHoveredPlace] = useState(null)

  const mapBounds = {
    minLat: 5.35,
    maxLat: 5.5,
    minLng: 100.2,
    maxLng: 100.4,
  }

  const getPositionOnMap = (coordinates) => {
    const [lat, lng] = coordinates
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
  }

  return (
    <div className="h-full relative overflow-hidden">
      {/* Map Background - More realistic styling */}
      <div
        ref={mapRef}
        className="w-full h-full relative"
        style={{
          background: `
            linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%),
            radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Penang Island Shape */}
        <div className="absolute inset-8 border-2 border-dashed border-gray-400 rounded-3xl opacity-40 bg-white/20"></div>

        {/* Place Markers */}
        {places.map((place, index) => {
          const position = getPositionOnMap(place.coordinates)
          const isSelected = selectedPlace?.name === place.name
          const isHovered = hoveredPlace?.name === place.name

          return (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                isSelected || isHovered ? "scale-110 z-20" : "z-10"
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={() => onPlaceSelect(place)}
              onMouseEnter={() => setHoveredPlace(place)}
              onMouseLeave={() => setHoveredPlace(null)}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full border-3 border-white shadow-lg ${
                    categoryColors[place.category] || "bg-gray-500"
                  } ${isSelected ? "ring-4 ring-teal-300" : ""}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Day Badge */}
                <div className="absolute -top-1 -right-1 bg-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md border text-gray-700">
                  {place.day}
                </div>
              </div>

              {/* Tooltip */}
              {(isHovered || isSelected) && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64 z-30">
                  <Card className="shadow-xl border-0">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm leading-tight">{place.name}</h4>
                        <Badge variant="secondary" className="text-xs ml-2">
                          Day {place.day}
                        </Badge>
                      </div>
                      {place.time && (
                        <p className="text-xs text-gray-600 mb-1">
                          {place.time} • {place.duration}
                        </p>
                      )}
                      <p className="text-xs text-gray-700 leading-relaxed">{place.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )
        })}

        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          {[1, 2].map((dayNum) => {
            const dayPlaces = places.filter((p) => p.day === dayNum)
            if (dayPlaces.length < 2) return null

            return dayPlaces.slice(0, -1).map((place, index) => {
              const currentPos = getPositionOnMap(place.coordinates)
              const nextPos = getPositionOnMap(dayPlaces[index + 1].coordinates)

              return (
                <line
                  key={`${dayNum}-${index}`}
                  x1={`${currentPos.x}%`}
                  y1={`${currentPos.y}%`}
                  x2={`${nextPos.x}%`}
                  y2={`${nextPos.y}%`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.8"
                />
              )
            })
          })}
        </svg>
      </div>
    </div>
  )
}
