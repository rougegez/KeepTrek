'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY

const MapboxMap = ({
    height = 400,
    initCenter = [101.6160160887531, 3.0644537753819425], // BizPod
    initZoom = 15
}) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    const [center, setCenter] = useState(initCenter)
    const [zoom, setZoom] = useState(initZoom)
    const [place, setPlace] = useState(null)

    useEffect(() => {
        if (mapContainer.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: center,
                zoom: zoom
            })

            mapRef.current.on('move', () => {
                if (mapRef.current) {
                    const mapCenter = mapRef.current.getCenter()
                    const mapZoom = mapRef.current.getZoom()
                    setCenter([mapCenter.lng, mapCenter.lat])
                    setZoom(mapZoom)
                }
            })

            mapRef.current.on('click', handleMapClick)
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
            }
        }
    }, [])

    const handleMapClick = async (e) => {
        if (mapRef.current) {
            // Remove existing marker if any
            if (markerRef.current) {
                markerRef.current.remove()
            }

            // Add new marker
            markerRef.current = new mapboxgl.Marker()
                .setLngLat(e.lngLat)
                .addTo(mapRef.current)

            // Fetch place information
            try {
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
                const data = await response.json()
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0]
                    setPlace({
                        name: feature.text,
                        address: feature.place_name
                    })
                } else {
                    setPlace(null)
                }
            } catch (error) {
                console.error('Error fetching place information:', error)
                setPlace(null)
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative w-full" style={{ height: height }}>
                <div ref={mapContainer} className="h-full w-full" />
                {place && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Card className="bg-white bg-opacity-90">
                            <CardHeader>
                                <CardTitle>{place.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{place.address}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MapboxMap

