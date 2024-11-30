import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapSearchBar = ({ mapInstance, onLocationSearch, searchButton, onChange, initialPlace}) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [place, setPlace] = useState("");
    const [showSearch, setShowSearch] = useState(true);

    useEffect(() => {
        if (!searchButton) {
            setShowSearch(false)
        }
    }, [searchButton])

    useEffect (() => {
        if (initialPlace) {
            setQuery(initialPlace)
        }
    }, [initialPlace])


    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 4) {
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
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.text);
        setPlace(suggestion);
        console.log(place)
        setSuggestions([]);
        // if (onLocationSearch) {
        //     onLocationSearch(suggestion);
        // }

        if (onChange) {
            onChange(suggestion.place_name)
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
                {showSearch && (
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

