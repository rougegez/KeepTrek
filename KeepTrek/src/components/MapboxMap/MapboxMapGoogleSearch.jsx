'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import MapSearchBar from './GoogleMapsSearchbar'
import { data } from 'autoprefixer'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapboxMap = ({
    height = '750px',
    width = '750px',
    initCenter = [101.6160160887531, 3.0644537753819425], // BizPod
    initZoom = 15,
    onSaveLocation,
    onMapLoad,
    initialPlace = null
}) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    const [center, setCenter] = useState(initCenter)
    const [zoom, setZoom] = useState(initZoom)
    const [place, setPlace] = useState(null)

    useEffect(() => {
        if (initialPlace) {
            handlePlaceUpdate(initialPlace)
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
                console.log(data)
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
        if (suggestion) {
            try {
                const response = await fetch(
                    `https://places.googleapis.com/v1/places/${suggestion.placePrediction.placeId}?fields=displayName,formattedAddress,location,types,viewport&key=${GOOGLE_MAPS_API_KEY}`
                )
                const data = await response.json()
                const newPlace = {
                    name: data.displayName.text,
                    address: data.formattedAddress,
                    coordinates: [data.location.longitude, data.location.latitude]
                }
                handlePlaceUpdate(newPlace)
                console.log(data)
            } catch (error) {
                console.error('Error fetching place information:', error)
            }
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

