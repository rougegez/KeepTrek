import React, { useState, useRef } from "react";
import MapboxMap from "./MapboxMapV5";
import SavedLocations from "./SavedLocations";
import MapSearchBar from "./MapSearchbarGeoAPIV5";

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
            const place = {
                name: suggestion.text,
                address: suggestion.place_name,
                coordinates: suggestion.center
            };
            setSearchedPlace(place);
        }
    };

    return (
        <div className="m-0 p-0">
            <MapSearchBar 
                mapInstance={mapInstance}
                onLocationSearch={handleLocationSearch}
            />
            <MapboxMap
                onSaveLocation={addSavedLocation}
                onMapLoad={handleMapLoad}
                initialPlace={searchedPlace}
            />
            <div className="mt-4">
                <SavedLocations locations={savedLocations} />
            </div>
        </div>
    );
};

