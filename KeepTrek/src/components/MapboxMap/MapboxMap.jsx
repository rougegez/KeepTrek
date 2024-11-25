'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY

const MapboxMap = ({
    height = 400
    , initCenter = [101.6160160887531, 3.0644537753819425] // BizPod
    , initZoom = 15 }) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)

    const [center, setCenter] = useState(initCenter)
    const [zoom, setZoom] = useState(initZoom)

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            //   style: 'mapbox://styles/mapbox/streets-v12'
            center: center,
            zoom: zoom
        })

        mapRef.current.on('move', () => {
            // get the current center coordinates and zoom level from the map
            const mapCenter = mapRef.current.getCenter()
            const mapZoom = mapRef.current.getZoom()
            // update state
            setCenter([mapCenter.lng, mapCenter.lat])
            setZoom(mapZoom)
        })

        return () => mapRef.current.remove()
    }, [])

    return (
        <div className="relative w-full" style={{height : height}}>
            {/*Map rendered in div*/}
            <div ref={mapContainer} className="h-full w-full" />
        </div>
    )
}

export default MapboxMap

