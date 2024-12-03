import React, { useState , useRef} from "react";

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
    const [mapInstance, setMapInstance] = useState(null);
    const [searchedPlace, setSearchedPlace] = useState(null);

    const handleMapLoad = (map) => {
        setMapInstance(map);
    };

    const addSavedLocation = (location) => {
        setSavedLocations((prev) => [...prev, location]);
    };

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
        };
    }
        return (
            <div className="flex justify-between m-0 p-20">
                <MapSearchBar
                    mapInstance={mapInstance}
                    onLocationSearch={handleLocationSearch}
                />
                <MapboxMap
                    onSaveLocation={addSavedLocation}
                    onMapLoad={handleMapLoad}
                    initialPlace={searchedPlace}
                    height="800px"
                />
                <div className="mt-4">
                    <SavedLocations locations={savedLocations} />
                </div>
            </div>
   
)};
