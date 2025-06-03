import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from 'use-debounce';
import { Search, X } from "lucide-react";

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

const MapSearchBar = ({
    isSearchbar = false,
    onLocationSearch,
    onInputChange,
    initialPlace,
    locationBias }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        loadGoogleMapsApi();
    }, []);

    useEffect(() => {
        if (initialPlace) {
            setQuery(initialPlace)
        }
    }, [initialPlace])

    const debouncedHandleInputChange = useDebouncedCallback(async (value) => {
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
                            locationBias: locationBias ? {rectangle : locationBias} : null,
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
        if (onInputChange) {
            onInputChange(value);
        }
    }, 500); // 500ms delay

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedHandleInputChange(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion?.placePrediction?.structuredFormat?.mainText?.text);
        setSuggestions([]);

        if (onInputChange) {
            onInputChange(suggestion)
        }
        if (onLocationSearch) {
            onLocationSearch(suggestion);
        }
    };

    const handleClearSearchbar = () => {
        setQuery("");
        setSuggestions([]);
        if (onInputChange) {
            onInputChange("");
        }
    }
    return (
        <>
            <div className="flex relative">
                <Input
                    type="text"
                    placeholder="Search for a location..."
                    value={query}
                    onChange={handleInputChange}
                    className={`w-full border bg-white ${isSearchbar ? "rounded-full  shadow-lg" : "rounded"}`}
                />
                {isSearchbar && (
                    query ?
                        <div
                            role='button'
                            className="absolute right-3 my-2 w-5 h-5 text-muted-foreground hover:text-black flex justify-start items-center"
                            onClick={handleClearSearchbar}
                        >
                            <X className="w-6 h-6" />
                        </div>
                        :
                        <Search className="absolute right-3 w-5 h-5 my-2 text-muted-foreground" />
                )
                }
            </div>
            {suggestions?.length > 0 && (
                <div className="relative">
                    <ul className="absolute w-full bg-white border border-gray-200 rounded z-20 shadow-lg ">
                        <li
                            className="pl-2 py-0 m-0 hover:bg-red-50 cursor-pointer"
                            onClick={() => setSuggestions([])}>
                            <span className="text-sm text-red-500">Clear Suggestions</span>
                        </li>
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion?.placePrediction?.placeId}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <strong>{suggestion?.placePrediction?.structuredFormat?.mainText?.text}</strong>
                                <br />
                                <span className="text-sm text-gray-500">
                                    {suggestion?.placePrediction?.structuredFormat?.secondaryText?.text ?? null}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default MapSearchBar;

