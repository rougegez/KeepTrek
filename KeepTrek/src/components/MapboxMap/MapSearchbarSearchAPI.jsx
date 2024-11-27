import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapSearchBar = ({ mapInstance, onLocationSearch }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    // Fetch autocomplete suggestions
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 3) {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(
                        value
                    )}&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&limit=5&auto_complete=true`
                );
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status}`);
                }

                const data = await response.json();

                // Update suggestions based on response
                setSuggestions(data.features || []); // Ensure a fallback to an empty array
            } catch (error) {
                console.error("Error fetching autocomplete suggestions:", error);
                setSuggestions([]); // Clear suggestions on error
            }
        } else {
            setSuggestions([]); // Clear suggestions if input is too short
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.properties.name || suggestion.place_name); // Use `properties.name` if available
        setSelectedSuggestion(suggestion);
        setSuggestions([]);
    };

    // Fly to the selected location on the map
    const handleSearchClick = () => {
        if (selectedSuggestion && mapInstance) {
            const [lng, lat] = selectedSuggestion.geometry.coordinates || selectedSuggestion.center;

            mapInstance.flyTo({
                center: [lng, lat],
                zoom: 15, // Adjust zoom level for a better view of the location
                essential: true,
            });

            if (onLocationSearch) {
                onLocationSearch(selectedSuggestion); // Pass to parent
            }
        } else {
            console.error("Map instance is not ready or no suggestion selected.");
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
                    className="flex-1"
                />
                <Button onClick={handleSearchClick} disabled={!selectedSuggestion}>
                    Search
                </Button>
            </div>

            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-200 rounded mt-1 z-20 shadow-lg">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.properties.mapbox_id || suggestion.id} // Use unique Mapbox ID if available
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <strong>{suggestion.properties.name}</strong>
                            <br />
                            <span className="text-sm text-gray-500">
                                {suggestion.properties.full_address || suggestion.properties.place_formatted || suggestion.place_name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MapSearchBar;
