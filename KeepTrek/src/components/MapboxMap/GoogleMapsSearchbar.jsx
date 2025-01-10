import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from 'use-debounce';

// Add this at the top of your component file
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Function to load Google Maps API script
const loadGoogleMapsApi = () => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

const MapSearchBar = ({ mapInstance, onLocationSearch, searchButton = true, onChange, initialPlace }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [place, setPlace] = useState("");

    useEffect(() => {
        loadGoogleMapsApi();
    }, []);

    useEffect(() => {
        if (initialPlace) {
            setQuery(initialPlace)
        }
    }, [initialPlace])

    const debouncedHandleInputChange = useDebouncedCallback(async (value) => {
        setPlace("");
        if (value.length > 3) {
            try {
                const response = await fetch(
                    `https://places.googleapis.com/v1/places:autocomplete`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        },
                        body: JSON.stringify({
                            input: value,
                            // locationBias: {
                            //     circle: {
                            //         center: {
                            //             latitude: 37.7937,
                            //             longitude: -122.3965
                            //         },
                            //         radius: 500.0
                            //     }
                            // }
                        })
                    }
                );
                const data = await response.json();
                setSuggestions(data.suggestions);
            } catch (error) {
                console.error("Error fetching autocomplete suggestions:", error);
                setSuggestions([]);
            }
        }
        if (onChange) {
            onChange(value);
        }
    }, 500); // 500ms delay

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedHandleInputChange(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.placePrediction.structuredFormat.mainText.text);
        setPlace(suggestion);
        setSuggestions([]);

        if (onChange) {
            onChange(suggestion)
        }
    };

    const handleSearchClick = () => {
        if (place) {
        onLocationSearch(place);
        }
    };

    return (
        <div className="relative w-full max-w-md mb-4">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Search for a location..."
                    value={query}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                />
                {searchButton && (
                    <Button onClick={handleSearchClick}>
                        Search
                    </Button>
                )}
            </div>
            {suggestions?.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-200 rounded mt-1 z-20 shadow-lg">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.placePrediction.placeId}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <strong>{suggestion.placePrediction.structuredFormat.mainText.text}</strong>
                            <br />
                            <span className="text-sm text-gray-500">
                                {suggestion.placePrediction.structuredFormat.secondaryText.text}
                            </span>
                        </li>
                    ))}
                    <li 
                    className="p-0 m-0 hover:bg-red-50 cursor-pointer"
                    onClick={() => setSuggestions([])}>
                        <span className="text-sm text-red-500">Clear Suggestions</span>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default MapSearchBar;

