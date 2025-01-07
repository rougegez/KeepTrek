// src/apis/dateFinder.js

const BASE_URL = "http://localhost:8000"; // Your backend's base URL

/**
 * Fetch available trips for the current user.
 * @param {string} token - The authentication token.
 * @returns {Promise<object[]>} - The list of available trips.
 */
export const fetchAvailableTrips = async (token) => {
  const response = await fetch(`${BASE_URL}/trip/user-trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch available trips");
  }

  return response.json();
};

/**
 * Update the user's availability for a specific trip.
 * @param {string[]} availableDates - List of dates in ISO format.
 * @param {string} tripID - The ID of the trip.
 * @param {string} token - The authentication token.
 * @returns {Promise<object>} - The response from the backend.
 */
export const updateAvailability = async (availableDates, tripID, token) => {
  const response = await fetch(`${BASE_URL}/date-finder/update-availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      available_dates: availableDates,
      tripID,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update availability");
  }

  return response.json();
};
