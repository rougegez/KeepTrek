import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SavedLocations = ({ locations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Locations</CardTitle>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <p>No locations saved yet.</p>
        ) : (
          <ul className="space-y-2">
            {locations.map((location, index) => (
              <li key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                <h3 className="font-semibold">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.address}</p>
                <p className="text-xs text-gray-400">
                  Coordinates: {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default SavedLocations