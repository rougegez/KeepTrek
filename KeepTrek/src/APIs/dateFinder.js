import axios from "./axiosConfig";

/**
 * Fetch available trips for the current user.
 * @returns {Promise<object[]>} - The list of available trips.
 */
/**
 * Fetch details of a specific trip.
 * @param {string} tripID - The trip ID to fetch.
 * @returns {Promise<object>} - The trip details.
 */


export const fetchAvailableTrips = async () => {
  const response = await axios.get("/trip/user-trips");
  return response.data;
};


export const fetchTripDetails = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}`);
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

export const getSuggestedPeriods = async (tripID) => {
  const response = await axios.get(
    `/date-finder/trip/${tripID}/suggested-periods`
  );
  return response.data;
};

export const getRangeAvailabilityUsernames = async (
  tripID,
  startDate,
  endDate
) => {
  const response = await axios.get(
    `/date-finder/trip/${tripID}/availability-usernames`,
    { params: { start_date: startDate, end_date: endDate } }
  );
  return response.data.usernames;
};

export const updateTripPeriod = async (tripID, newPeriod) => {
  const response = await axios.post(
    `/date-finder/trip/${tripID}/update-period`,
    newPeriod
  );
  return response.data;
};

export const getUserAvailability = async (tripID) => {
  const response = await axios.get(
    `/date-finder/trip/${tripID}/user-availability`
  );
  return response.data.available_dates;
};

export const getSelectedPeriod = async (tripID) => {
  const response = await axios.get(`/date-finder/trip/${tripID}/selected-period`);
  return response.data;
};
