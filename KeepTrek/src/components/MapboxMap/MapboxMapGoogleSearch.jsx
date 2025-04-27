'use client'

import React, { useEffect, useState, useMemo, memo } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Clock, Globe, MapPin, X, Map as MapIcon} from 'lucide-react'
import MapSearchBar from './GoogleMapsSearchbar'
import { fetchPlaceDetails } from '@/APIs/fetchPlaceDetails.js'
import Map, { Marker, useMap } from 'react-map-gl/mapbox';

import { MarkerSvg, getDayIndex , getDayColor, getMaxDay, getCategoryAppearance, getMarkerType} from '@/components/MapboxMap/MapUtil.jsx'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapboxMap = ({
    height = '100%',
    width = '100%',
    initCenter = [101.6160160887531, 3.0644537753819425], // BizPod
    initZoom = 15,
    onSaveLocation,
    handlePanTo = null,
    disableSearchBar = false,
    disableSaveLocation = false,
    markers = [],
}) => {

    const { map: mapRef } = useMap()
    const [viewState, setViewState] = useState({
        longitude: initCenter[0] ?? 101.6160160887531,
        latitude: initCenter[1] ?? 3.0644537753819425,
        zoom: initZoom,
    });
    const [dropMarker, setDropMarker] = useState({
        showDropMarker: false,
        longitude: 0,
        latitude: 0,
    })

    const [place, setPlace] = useState(null)
    const [imageError, setImageError] = useState(false)


    useEffect(() => {
        if (handlePanTo) {
            handlePlaceUpdate(handlePanTo?.clickLocation ?? handlePanTo)
        }
    }, [handlePanTo])

    const handlePlaceUpdate = (newPlace) => {
        if (mapRef && newPlace.coordinates) {

            setDropMarker({
                showDropMarker: true,
                longitude: newPlace.coordinates[0],
                latitude: newPlace.coordinates[1],
            })

            mapRef.flyTo({
                center: newPlace.coordinates,
                zoom: initZoom
            })

            setPlace(newPlace)
        }
    }

    const handleMapClick = async (e) => {
        setDropMarker({
            showDropMarker: true,
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
        })

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

    const handleSaveLocation = () => {
        if (place) {
            onSaveLocation(place)
        }
    }

    const handleCloseLocation = () => {
        if (place) {
            setPlace(null)
            setDropMarker(prev => ({
                ...prev,
                showDropMarker: false
            }))
        }
    }

    const handleLocationSearch = async (suggestion) => {
        const newPlace = await fetchPlaceDetails(suggestion.placePrediction.placeId)
        if (newPlace) {
            handlePlaceUpdate(newPlace)
        }
    }

    const handleDropMarkerClick = (e) => {
        e.originalEvent.preventDefault()
        e.originalEvent.stopPropagation()
        setDropMarker(prev => ({...prev, showDropMarker : false}))
        setPlace(null)
    }

    const memoMarkers = useMemo(() => markers.map((marker, index) => {
        if (!marker?.latitude || !marker?.longitude) return null

        // If this marker is associated with a day, parse it and get a color.
        let color = "#4db6ac"
        if (marker.day) { // Itinerary
            const maxDay = getMaxDay(markers)
            color = getDayColor(marker.day, maxDay);
        } else if (marker.category) { // Wishlist
            color = getCategoryAppearance(marker).color;
        }

        return (<Marker
            key={index}
            latitude={marker.latitude}
            longitude={marker.longitude}
            onClick={(e) => {
                e.originalEvent.preventDefault()
                e.originalEvent.stopPropagation()
                setPlace(marker)
            }}
        >
            <MarkerSvg color={color}>
                {marker?.category ? // if has category = from wishlist, otherwise from itinerary
                    <g transform="translate(13.5, 13.5)">
                        <foreignObject x="-13.5" y="-13.5" width="27" height="27">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                {getMarkerType(marker.category, { size: 20, color: '#ffffff' })}
                            </div>
                        </foreignObject>
                    </g> :
                    <text
                        x="13.5"
                        y="13.5"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: '14px', fill: '#ffffff', fontWeight: 'bold' }}
                    >
                        {marker.order}
                    </text>
                }
            </MarkerSvg>
        </Marker>)
    }), [markers])

    return (
        <>
            <Map
                {...viewState}
                id="map"
                reuseMaps
                onMove={evt => setViewState(evt.viewState)}
                onClick={handleMapClick}
                style={{ width: width, height: height }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
            >;
                {dropMarker.showDropMarker && (
                    <Marker
                        latitude={dropMarker.latitude}
                        longitude={dropMarker.longitude}
                        onClick={handleDropMarkerClick}
                    />
                )}
                {((memoMarkers.length !== 0) && !dropMarker.showDropMarker) && (
                    memoMarkers
                )}
            </Map>
            {!disableSearchBar && (
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="w-full max-w-md mx-auto">
                        <MapSearchBar
                            onLocationSearch={handleLocationSearch}
                            searchButton={true}
                        />
                    </div>
                </div>
            )}
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
                                            <MapIcon size={12} className="flex-shrink-0" />
                                            <a href={place.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 text-[10px] md:text-sm">
                                                View on Google Maps
                                            </a>
                                        </div>
                                    )}
                                    {!disableSaveLocation && (
                                        <Button
                                            onClick={handleSaveLocation}
                                            className="mt-1 md:mt-2 w-full md:w-auto text-[10px] md:text-sm py-1 md:py-2 h-auto"
                                        >
                                            Save Location
                                        </Button>
                                    )}
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
        </>
    )
}

export default MapboxMap


