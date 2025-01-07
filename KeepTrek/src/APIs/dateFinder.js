import axios from "./axiosConfig";

/**
 * Fetch available trips for the current user.
 * @returns {Promise<object[]>} - The list of available trips.
 */
export const fetchAvailableTrips = async () => {
  const response = await axios.get("/trip/user-trips");
  return response.data;
};

/**
 * Update the user's availability for a specific trip.
 * @param {string[]} availableDates - List of dates in ISO format.
 * @param {string} tripID - The ID of the trip.
 * @returns {Promise<object>} - The response from the backend.
 */
export const updateAvailability = async (availableDates, tripID) => {
  const response = await axios.post("/date-finder/update-availability", {
    available_dates: availableDates,
    tripID,
  });
  return response.data;
};
