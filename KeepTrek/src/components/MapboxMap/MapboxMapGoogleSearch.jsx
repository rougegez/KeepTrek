'use client'

import React, { useEffect, useState, useMemo , useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapSearchBar from './GoogleMapsSearchbar'
import { fetchPlaceDetails } from '@/APIs/fetchPlaceDetails.js'
import Map, {
    Marker,
    useMap,
    ScaleControl,
    GeolocateControl,
    NavigationControl,
} from 'react-map-gl/mapbox';

import { MarkerSvg, getDayColor, getMaxDay, getCategoryAppearance, getMarkerType, getDayNumber } from '@/components/MapboxMap/MapUtil.jsx'

import PinControl from '@/components/MapboxMap/PinControl.jsx'
import LocationCard from '@/components/MapboxMap/LocationCard.jsx'
import ResetMapButton from '@/components/MapboxMap/ResetMapButton.jsx'

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
    itineraryDays = [],
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

    const selectedDay = useRef(null);

    useEffect(() => {
        if (handlePanTo) {
            goToLocation(handlePanTo?.clickLocation ?? handlePanTo)
        }
    }, [handlePanTo])

    const goToLocation = (place) => {
        if (mapRef && place.coordinates) {
            mapRef.flyTo({
                center: place.coordinates,
                zoom: initZoom,
            })
            setPlace(place)
        }
    }

    const handlePlaceUpdate = (newPlace) => {
        if (mapRef && newPlace.coordinates) {

            setDropMarker({
                showDropMarker: true,
                longitude: newPlace.coordinates[0],
                latitude: newPlace.coordinates[1],
            })

            if (newPlace.viewport) {
                const { high, low  } = newPlace.viewport
                const bounds = [
                    [high.longitude, high.latitude],
                    [low.longitude, low.latitude],
                ]
                mapRef.fitBounds(bounds, {
                    padding: 100,
                    // duration: 1000,
                    maxZoom: 15,
                })
            }
            else if (newPlace.coordinates) {
                mapRef.flyTo({
                    center: newPlace.coordinates,
                    zoom: viewState.zoom,
                })
            }

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
            onSaveLocation(place, selectedDay.current)
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
        setDropMarker(prev => ({ ...prev, showDropMarker: false }))
        setPlace(null)
    }

    const [mapControls, setMapControls] = useState(() => {
        if (markers[0]?.day) {
            const { maxDay, dayNumbers } = getMaxDay(markers)
            const unique = new Set(dayNumbers)
            const controls = Array.from(unique).map((day, index) => {
                const color = getDayColor(`${day}`, maxDay)
                return ({ day: day, color: color, checked: true })
            })
            return controls
        }
        else if (markers[0]?.category) {
            const controls = [{ category: "Accommodation" }, { category: "Activities" }, { category: "Food" }]
            return controls.map((item) => {
                return ({ category: item.category, color: getCategoryAppearance(item).color, checked: true })
            })
        }
    })

    useEffect(() => {
        setMapControls(() => {
            if (markers[0]?.day) {
                const { maxDay, dayNumbers } = getMaxDay(markers)
                const unique = new Set(dayNumbers)
                const controls = Array.from(unique).map((day, index) => {
                    const color = getDayColor(`${day}`, maxDay)
                    return ({ day: day, color: color, checked: true })
                })
                return controls
            }
            else if (markers[0]?.category) {
                const controls = [{ category: "Accommodation" }, { category: "Activities" }, { category: "Food" }]
                return controls.map((item) => {
                    return ({ category: item.category, color: getCategoryAppearance(item).color, checked: true })
                })
            }
        })
    }, [markers]);

    const handleCheckChange = (checked, marker) => {
        const updatedMarkers = mapControls.map((item) => {
            if (marker?.category) {
                return item.category === marker.category ? { ...item, checked: checked } : item
            } else {
                return item.day === marker.day ? { ...item, checked: checked } : item
            }
        })
        setMapControls(updatedMarkers)
    }

    const handleCheckChangeAll = (checked) => {
        const updatedMarkers = mapControls.map((item) => {
            return { ...item, checked: checked }
        })
        setMapControls(updatedMarkers)
    }

    const memoMarkers = useMemo(() => markers.map((marker, index) => {
        if (!marker?.latitude || !marker?.longitude) return null

        if (marker.day && mapControls) {
            const controls = mapControls.find(({ day }) => day === getDayNumber(marker.day))
            if (!controls?.checked) return null
        }
        if (marker.category && mapControls) {
            const controls = mapControls.find(({ category }) => category.toLowerCase() === marker.category)
            if (!controls?.checked) return null
        }

        // If this marker is associated with a day, parse it and get a color.
        let color = "#4db6ac"
        if (marker.day) { // Itinerary
            const { maxDay } = getMaxDay(markers)
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
            className="cursor-pointer"
        >
            <MarkerSvg color={color}>
                {marker?.category ? // if has category = from wishlist, otherwise from itinerary
                    <g transform="translate(13.5, 13.5)">
                        <foreignObject x="-13.5" y="-13.5" width="27" height="27">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                {getMarkerType(marker.category, { size: 16, color: '#ffffff' , strokeWidth: 2.5})}
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
    }), [markers, mapControls])

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
            >

                <GeolocateControl position="bottom-right" />
                <NavigationControl position="bottom-right" />
                <ScaleControl style={{ backgroundColor: "hsl(0deg 0% 100% / 0%)" }} />

                {dropMarker.showDropMarker && (
                    <Marker
                        latitude={dropMarker.latitude}
                        longitude={dropMarker.longitude}
                        onClick={handleDropMarkerClick}
                        className="cursor-pointer"
                    >
                        <MarkerSvg />
                    </Marker>
                )}

                {((memoMarkers.length !== 0) && !dropMarker.showDropMarker) && (
                    memoMarkers
                )}
            </Map>


            <div className={`absolute flex top-4 w-full px-4 gap-2 ${disableSearchBar ? 'justify-end' : 'justify-between'}`}>
                {!disableSearchBar && (
                    <div className="left-4 z-10 w-full max-w-md">
                        <MapSearchBar
                            onLocationSearch={handleLocationSearch}
                            searchButton={true}
                        />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <PinControl
                        markers={markers}
                        mapControls={mapControls}
                        onCheckedChange={handleCheckChange}
                        onCheckedChangeAll={handleCheckChangeAll}
                    />
                    <ResetMapButton initCenter={initCenter} initZoom={initZoom} />
                </div>
            </div>

            {place && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <LocationCard
                        place={place}
                        onClick={handleCloseLocation}
                        onSaveLocation={handleSaveLocation}
                        disableSaveLocation={disableSaveLocation}
                        itineraryDays={itineraryDays}
                        onDaySelected={(day) => {selectedDay.current = day}}
                        daySelected={selectedDay.current}
                    />
                </div>
            )}

        </>
    )
}

export default MapboxMap


