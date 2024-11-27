// https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
// Properties of the response.json
// Have to use this until Search function in Mapbox has included Malaysia

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapSearchBar = ({ mapInstance , onLocationSearch}) => {

    const [query, setQuery] = useState(""); // User input
    const [suggestions, setSuggestions] = useState([]); // Autocomplete suggestions
    const [selectedSuggestion, setSelectedSuggestion] = useState(null); // Chosen location details

    const handleInputChange = async (e) => {

        const value = e.target.value;
        setQuery(value);

        if (value.length > 4) {

            // Fetch autocomplete suggestions from Mapbox
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
            setSuggestions([]); // Clear suggestions for short input
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.text); // Set the search bar to the clicked suggestion
        setSelectedSuggestion(suggestion); // Save the selected suggestion details
        setSuggestions([]); // Clear suggestions
    };

    const handleSearchClick = () => {
        if (selectedSuggestion && mapInstance) {
            const [lng, lat] = selectedSuggestion.center; // Extract coordinates
            console.log("Panning to:", lng, lat); // Debug log
            mapInstance.flyTo({ 
                center: [lng, lat], 
                zoom: 15, 
                essential: true }); // Pan the map
                
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
                {/* Input Field */}
                <Input
                    type="text"
                    placeholder="Search for a location..."
                    value={query}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />

                {/* Search Button */}
                <Button
                    onClick={handleSearchClick}
                >
                    Search
                </Button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-200 rounded mt-1 z-20 shadow-lg">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id} // Use unique Mapbox ID if available
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