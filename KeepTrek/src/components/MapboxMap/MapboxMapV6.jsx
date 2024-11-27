'use client'

import React, { useRef, useEffect, useState } from 'react'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchBox } from '@mapbox/search-js-react'
import { X } from 'lucide-react'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY

const MapboxMap = ({
    height = '400px',
    initCenter = [101.6160160887531, 3.0644537753819425], // BizPod
    initZoom = 15,
    onSaveLocation,
    onMapLoad,
    initialPlace = null
}) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    const [inputValue, setInputValue] = useState("");
    const [center, setCenter] = useState(initCenter)
    const [zoom, setZoom] = useState(initZoom)
    const [place, setPlace] = useState(null)

    useEffect(() => {
        if (initialPlace) {
            // Add marker if not already present
            if (mapRef.current && initialPlace.coordinates) {
                // Remove existing marker
                if (markerRef.current) {
                    markerRef.current.remove()
                }

                // Create new marker
                markerRef.current = new mapboxgl.Marker()
                    .setLngLat(initialPlace.coordinates)
                    .addTo(mapRef.current)

                // Pan map to the location
                mapRef.current.flyTo({
                    center: initialPlace.coordinates,
                    zoom: initZoom
                })

                // Set the place state
                setPlace(initialPlace)
            }
        }
    }, [initialPlace])

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

            if (onMapLoad) {
                onMapLoad(mapRef.current)
            }
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
                const response = await fetch(
                    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${e.lngLat.lng}&latitude=${e.lngLat.lat}&access_token=${mapboxgl.accessToken}`)
                const data = await response.json()
                console.log(data)
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0]
                    setPlace({
                        name: feature.properties.name,
                        address: feature.properties.full_address,
                        clicked_coordinates: [e.lngLat.lng, e.lngLat.lat],
                        real_coordinates: feature.properties.coordinates
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

    const handleSaveLocation = () => {
        if (place) {
            onSaveLocation(place)
        }
    }

    const handleCloseLocation = () => {
        if (place) {
            setPlace(null)
            if (markerRef.current) {
                markerRef.current.remove()
            }
        }
    }

    const handleSelectLocation = (res) => {
        if (res.features && res.features.length > 0) {
            const selectedFeature = res.features[0]; // Example: select the first suggestion
            setPlace({
                name: selectedFeature.properties.name,
                address: selectedFeature.properties.name,
                coordinates: selectedFeature.geometry.coordinates,
            });
        }
    }

    return (
        <div className="relative w-full" style={{ height: height }}>
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="p-4 w-2/5">
                <SearchBox
                    accessToken={import.meta.env.VITE_MAPBOX_API_KEY}
                    map={mapRef.current}
                    mapboxgl={mapboxgl}
                    options={{
                        country: "MY"
                    }}
                    value={inputValue}
                    onChange={(d) => {
                        setInputValue(d);
                    }}
                    interceptSearch={(value) => value.length > 3 ? value : null}
                    onRetrieve={handleSelectLocation}
                    marker
                />
            </div>
            {place && (
                <div
                    className="absolute bottom-4 left-4 right-4 z-10">
                    <Card className="relative bg-white bg-opacity-90">
                        <CardHeader>
                            <Button
                                className="absolute top-2 right-2 bg-transparent outline-none 
                                shadow-none rounded-full hover:bg-black/5"
                                size="icon"
                                onClick={handleCloseLocation}>
                                <X color="black" />
                            </Button>
                            <CardTitle className="align-middle">{place.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">{place.address}</p>
                            <Button onClick={handleSaveLocation}>Save Location</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default MapboxMap
