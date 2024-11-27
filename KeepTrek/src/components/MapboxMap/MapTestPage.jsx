import React, {useState, useRef } from "react";

//------------------------------------
import MapboxMap from "../MapboxMap/MapboxMapV5.jsx";
// import MapboxMap from "../MapboxMap/MapboxMapV6.jsx"; 

import SavedLocations from "../MapboxMap/SavedLocations.jsx";

// import MapSearchBar from "../MapboxMap/MapSearchbarSearchAPI"; 
// import MapSearchBar from "../MapboxMap/MapSearchbarGeoAPIV6.jsx";
import MapSearchBar from "../MapboxMap/MapSearchbarGeoAPIV5.jsx"
//------------------------------------

export const MapTestPage = () => {
    const [savedLocations, setSavedLocations] = useState([]);
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null)
    const [searchedPlace, setSearchedPlace] = useState(null)

    const handleMapLoad = (map) => {
        setMapInstance(map)
        mapRef.current = map
    }

    const addSavedLocation = (location) => {
        setSavedLocations((prev) => [...prev, location]);
    }

    const handleLocationSearch = (suggestion) => {
        if (suggestion && suggestion.center) {
            // Create a place object similar to what's used in MapboxMap
            const place = {
                name: suggestion.text,
                address: suggestion.place_name,
                coordinates: suggestion.center
            }

            // Set the selected place to trigger the card in MapboxMap
            setSearchedPlace(place)
        }

        // If using V6 API
        if (suggestion.properties && suggestion.properties.coordinates) {
            const place = {
                name: suggestion.properties.name,
                address: suggestion.properties.full_address || suggestion.properties.place_formatted,
                coordinates: suggestion.geometry.coordinates,
            }

            setSearchedPlace(place)
        }
    }

    return (
        <>
            <div className="p-20">
                {/* SearchBar, change import for Geocoding or Search API*/}
                <MapSearchBar 
                mapInstance={mapInstance}
                onLocationSearch={handleLocationSearch} />

                {/* Mapbox Map with Save Location Callback */}
                <MapboxMap
                    onSaveLocation={addSavedLocation}
                    onMapLoad={handleMapLoad}
                    initialPlace={searchedPlace}
                />
                {/* Saved Locations Display */}
                <div className="mt-4">
                    <SavedLocations locations={savedLocations} />
                </div>
            </div>
        </>
    );
}