import { memo } from 'react';
import { Bed, Tickets, Utensils } from 'lucide-react';

function getDayIndex() {
    const today = new Date().getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    return today === 0 ? 6 : today - 1; // Adjusting so Monday = 0
}

// wrapper for standard map pin
const MarkerSvg = memo(function MarkerSvg({ children, color = "#4DB6AC" , height = "41px", width = "27px"}) {
    return (
        <svg display="block" height={height} width={width} viewBox="0 0 27 41">
            <defs>
                <radialGradient id="shadowGradient">
                    <stop offset="10%" stopOpacity="0.4"></stop>
                    <stop offset="100%" stopOpacity="0.05"></stop>
                </radialGradient>
            </defs>
            <ellipse cx="13.5" cy="34.8" rx="10.5" ry="5.25" fill="url(#shadowGradient)"></ellipse>
            <path fill={color} d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"></path>
            <path opacity="0.25" d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"></path>
            {children ?
                children :
                <circle fill="#ffffff" opacity="1" cx="13.5" cy="13.5" r="5.5"></circle>}
        </svg>
    )
})

// normalize itinerary (first if condition) or wishlist data (second if condition) for displaying markers
function normalizeMarkers(data) {
    // If data is an array with day objects
    if (Array.isArray(data) && data.length > 0) {
        return data.reduce((acc, dayObj) => {
            const markersForDay = dayObj.activities.map((item, index) => {
                const { location, title, coordinates, day, ...rest } = item;
                const newData = {
                    day: dayObj.date,
                    order: index + 1, // item's order within that day
                    address: location,
                    latitude: coordinates[1],
                    longitude: coordinates[0],
                    name: title,
                    ...rest
                };
                return newData
            });
            return acc.concat(markersForDay);
        }, []);
    }
    // If data is an object with keys like accommodation, activities, etc.
    else if (data && typeof data === 'object') {
        return Object.values(data).reduce((acc, group) => {
            const normalized = group.map(item => {
                const { location, title, coordinates, ...rest } = item;
                return {
                    address: location,
                    latitude: coordinates[1],
                    longitude: coordinates[0],
                    name: title,
                    ...rest
                }
            });
            return acc.concat(normalized);
        }, []);
    }
    return [];
}

// Helper to parse day number from strings like "Day 1"
function getDayNumber(dayStr) {
    const match = dayStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
}

// Array means itinerary, object is from wishlist
function getMaxDay(markers) {
    const dayNumbers = Array.isArray(markers) ?
        markers
            .filter(marker => marker.day)
            .map(marker => getDayNumber(marker.day)) :
        []
    const maxDay = dayNumbers.length > 0 ? Math.max(...dayNumbers) : 1;
    return {maxDay : maxDay, dayNumbers : dayNumbers};
}

// Function to calculate a color for a given day.
// This function interpolates hue from 10 (warm red/orange) to 240 (cold blue)
// For extra days, it uses modulo to "loop" and then changes the lightness.
function getDayColor(day, totalDays) {
    const dayNumber = getDayNumber(day);
    // If totalDays is 1, just return the warm base.
    if (totalDays <= 1) return 'hsl(10, 70%, 50%)';
    // Determine a fraction from 0 to 1 for day within totalDays.
    const dayIndex = (dayNumber - 1) % totalDays;
    const fraction = dayIndex / (totalDays - 1);
    // Interpolate hue from 10 (warm) to 240 (cold)
    const hue = Math.round(10 + fraction * (240 - 10));
    // If you loop (day > totalDays), adjust lightness to differentiate further.
    const extraLoops = Math.floor((dayNumber - 1) / totalDays);
    const baseLightness = 53;
    const lightness = Math.max(Math.min(baseLightness - extraLoops * 10, 70), 30);
    return `hsl(${hue}, 70%, ${lightness}%)`;
}

function getMarkerType(type, { ...props } = null) {
    // Normalize type to lowercase for consistency
    const normalizedType = type.toLowerCase();
    if (normalizedType === 'accommodation') {
        return <Bed {...props} />
    }
    if (normalizedType === 'activities') {
        return <Tickets {...props} />
    }
    if (normalizedType === 'food') {
        return <Utensils {...props} />
    }
}

const categoryPalettes = {
    accommodation: { baseHue: 10, baseSaturation: 70, baseLightness: 53 },
    activities: { baseHue: 120, baseSaturation: 70, baseLightness: 53 },
    food: { baseHue: 240, baseSaturation: 70, baseLightness: 53 },
};

function getCategoryAppearance(marker) {
    const { category } = marker;
    const type = category.toLowerCase(); // Normalize to lowercase
    // If the marker type doesn't exist in our palettes, return a default look.
    const palette = categoryPalettes[type] || { baseHue: 0, baseSaturation: 70, baseLightness: 50 };

    const upCount = marker.upvotes ? marker.upvotes.length : 0;
    const downCount = marker.downvotes ? marker.downvotes.length : 0;
    const net = upCount - downCount;

    // Adjust saturation: more positive net => bolder saturation; more negative net => less saturated.
    const saturation = Math.max(Math.min(palette.baseSaturation + net * 5, 100), 30);
    // Adjust lightness: net positive makes it a bit darker, negative makes it lighter.
    const lightness = Math.max(Math.min(palette.baseLightness - net * 2, 70), 30);
    // For overall opacity, drop the marker’s opacity for very low (negative net) scores.
    const opacity = net >= 0 ? 1 : Math.max(1 + net / 10, 0.3);

    return {
        color: `hsla(${palette.baseHue}, ${saturation}%, ${lightness}%, ${opacity})`,
        opacity,
    };
}


export { MarkerSvg, getDayIndex, normalizeMarkers, getDayNumber, getMaxDay, getDayColor, getCategoryAppearance, getMarkerType }
