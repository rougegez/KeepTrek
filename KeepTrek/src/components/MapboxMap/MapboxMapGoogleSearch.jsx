'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button"
import { Clock, Globe, Map, MapPin, Star, X } from 'lucide-react'
import MapSearchBar from './GoogleMapsSearchbar'
import { fetchPlaceDetails } from '@/utils/fetchPlaceDetails.jsx'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapboxMap = ({
    height = '750px',
    width = '750px',
    initCenter = [101.6160160887531, 3.0644537753819425], // BizPod
    initZoom = 15,
    onSaveLocation,
    onMapLoad,
    handlePanTo = null
}) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    const [center, setCenter] = useState(initCenter)
    const [zoom, setZoom] = useState(initZoom)
    const [place, setPlace] = useState(null)
    const [imageError, setImageError] = useState(false)


    useEffect(() => {
        if (handlePanTo) {
            handlePlaceUpdate(handlePanTo?.clickLocation ?? handlePanTo)
        }
    }, [handlePanTo])

    useEffect(() => {
        if (mapContainer.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: center[0] ? center : [101.6160160887531, 3.0644537753819425],
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

    const handlePlaceUpdate = (newPlace) => {
        if (mapRef.current && newPlace.coordinates) {
            if (markerRef.current) {
                markerRef.current.remove()
            }

            markerRef.current = new mapboxgl.Marker()
                .setLngLat(newPlace.coordinates)
                .addTo(mapRef.current)

            mapRef.current.flyTo({
                center: newPlace.coordinates,
                zoom: initZoom
            })

            setPlace(newPlace)
        }
    }

    const handleMapClick = async (e) => {
        if (mapRef.current) {
            if (markerRef.current) {
                markerRef.current.remove()
            }

            markerRef.current = new mapboxgl.Marker()
                .setLngLat(e.lngLat)
                .addTo(mapRef.current)

            try {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.lngLat.lat},${e.lngLat.lng}&key=${GOOGLE_MAPS_API_KEY}`)
                const data = await response.json()
                if (data.results && data.results.length > 0) {

                    let feature = ""
                    for (const result of data.results) {
                        if (!result.formatted_address.includes('+')) {
                            feature = result;
                            break
                        }
                    }

                    let cardname = ""
                    componentLoop: for (const i of feature.address_components) {
                        for (const j of i.types) {
                            if (!(j == "street_number")) {
                                cardname = i.long_name
                                break componentLoop;
                            }
                        }
                    }
                    setPlace({
                        name: cardname,
                        address: feature.formatted_address,
                        coordinates: [e.lngLat.lng, e.lngLat.lat]
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

    const handleLocationSearch = async (suggestion) => {
        const newPlace = await fetchPlaceDetails(suggestion.placePrediction.placeId)
        if (newPlace) {
            handlePlaceUpdate(newPlace)
        }
    }

    return (
        <div className="relative w-full" style={{ height: height, width: width }}>
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="w-full max-w-md mx-auto">
                    <MapSearchBar
                        mapInstance={mapRef.current}
                        onLocationSearch={handleLocationSearch}
                        searchButton={true}
                    />
                </div>
            </div>
            {place && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <Card className="relative bg-white bg-opacity-90">
                        <CardHeader className="pb-0 md:pb-6 pt-2 md:pt-6">
                            <Button
                                className="absolute top-1 right-1 bg-transparent outline-none 
                                shadow-none rounded-full hover:bg-black/5 p-0.5"
                                size="icon"
                                onClick={handleCloseLocation}>
                                <X size={16} color="black" />
                            </Button>
                            {/* Image Container - Mobile */}
                            {place.image && !imageError && (
                                <div className="md:hidden absolute bottom-14 right-4 w-28 h-20 overflow-hidden rounded-md flex-shrink-0">
                                    <a href={place.link} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={place.image}
                                            alt={place.name}
                                            className="w-full h-full object-cover"
                                            onError={() => setImageError(true)}
                                            loading="lazy"
                                        />
                                    </a>
                                </div>
                            )}
                            <CardTitle className="text-base md:text-lg pr-24 md:pr-8 truncate">{place.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-1 px-3 md:px-6 pb-3">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                <div className="flex-1 space-y-1.5 md:space-y-3">
                                    {/* Address */}
                                    <div className="flex items-start gap-1 md:gap-2 pr-28 md:pr-0">
                                        <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                                        <p className="text-gray-500 text-[10px] md:text-sm line-clamp-3 md:line-clamp-none">{place.address}</p>
                                    </div>

                                    {/* Rating */}
                                    {place.rating?.rating > 0 && (
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 text-xs md:text-base">★</span>
                                            <p className="pl-1 text-gray-500 text-[10px] md:text-sm">{place.rating.rating}</p>
                                            <p className="pl-1 text-gray-500 text-[10px] md:text-sm">({place.rating.count})</p>
                                        </div>
                                    )}

                                    {/* Opening Hours */}
                                    {place.openingHours?.length > 2 && (
                                        <div className="flex gap-1 md:gap-2">
                                            <Clock size={12} className="flex-shrink-0 mt-0.5" />
                                            <Collapsible className="flex gap-0.5">
                                                <div>
                                                    <CollapsibleContent>
                                                        {place.openingHours.slice(0, getDayIndex()).map((day, index) => (
                                                            <div key={`pre-${index}`}>
                                                                <CollapsibleTrigger className="inline-block">
                                                                    <p className="text-gray-500 text-[10px] md:text-sm leading-tight">{day}</p>
                                                                </CollapsibleTrigger>
                                                            </div>
                                                        ))}
                                                    </CollapsibleContent>
                                                    <CollapsibleTrigger>
                                                        <span className="text-gray-500 text-[10px] md:text-sm leading-tight">{place.openingHours[getDayIndex()]}</span>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        {place.openingHours.slice(getDayIndex() + 1).map((day, index) => (
                                                            <div key={`post-${index}`}>
                                                                <CollapsibleTrigger className="inline-block">
                                                                    <p className="text-gray-500 text-[10px] md:text-sm leading-tight">{day}</p>
                                                                </CollapsibleTrigger>
                                                            </div>
                                                        ))}
                                                    </CollapsibleContent>
                                                </div>
                                            </Collapsible>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {place.website && (
                                        <div className="flex gap-1 md:gap-2 items-center">
                                            <Globe size={12} className="flex-shrink-0" />
                                            <a href={place.website} 
                                               target="_blank" 
                                               rel="noopener noreferrer" 
                                               className="text-blue-500 text-[10px] md:text-sm truncate">
                                                {place.website}
                                            </a>
                                        </div>
                                    )}

                                    {/* Google Maps Link */}
                                    {!place.image && place.link && (
                                        <div className="flex gap-1 md:gap-2 items-center">
                                            <Map size={12} className="flex-shrink-0" />
                                            <a href={place.link} 
                                               target="_blank" 
                                               rel="noopener noreferrer" 
                                               className="text-blue-500 text-[10px] md:text-sm">
                                                View on Google Maps
                                            </a>
                                        </div>
                                    )}

                                    <Button onClick={handleSaveLocation} className="mt-1 md:mt-2 w-full md:w-auto text-[10px] md:text-sm py-1 md:py-2 h-auto">
                                        Save Location
                                    </Button>
                                </div>

                                {/* Image Container - Desktop */}
                                {place.image && !imageError && (
                                    <div className="hidden md:block w-52 h-32 overflow-hidden rounded-lg">
                                        <a href={place.link} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={place.image}
                                                alt={place.name}
                                                className="w-full h-full object-cover"
                                                onError={() => setImageError(true)}
                                                loading="lazy"
                                            />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

function getDayIndex() {
    const today = new Date().getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    return today === 0 ? 6 : today - 1; // Adjusting so Monday = 0
}


export default MapboxMap

