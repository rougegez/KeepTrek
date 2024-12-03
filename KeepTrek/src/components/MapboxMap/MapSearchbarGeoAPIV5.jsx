// https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
// Properties of the response.json
// Have to use this until Search function in Mapbox has included Malaysia

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from 'use-debounce';

const MapSearchBar = ({ mapInstance, onLocationSearch, searchButton=true, onChange, initialPlace}) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [place, setPlace] = useState("");

    useEffect (() => {
        if (initialPlace) {
            setQuery(initialPlace)
        }
    }, [initialPlace])


    const debouncedHandleInputChange = useDebouncedCallback(async (value) => {
        if (value.length > 3) {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        value
                    )}.json?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&autocomplete=true&limit=5`
                );
                const data = await response.json();
                setSuggestions(data.features);
            } catch (error) {
                console.error("Error fetching autocomplete suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
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
        setQuery(suggestion.text);
        setPlace(suggestion);
        setSuggestions([]);
        // if (onLocationSearch) {
        //     onLocationSearch(suggestion);
        // }

        if (onChange) {
            onChange(suggestion)
        }
    };

    const handleSearchClick = () => {
        onLocationSearch(place);
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
            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-200 rounded mt-1 z-20 shadow-lg">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <strong>{suggestion.text}</strong>
                            <br />
                            <span className="text-sm text-gray-500">
                                {suggestion.place_name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MapSearchBar;

