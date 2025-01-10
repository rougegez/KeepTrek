import axios from "./axiosConfig"; // Base Axios instance

// Create Itinerary
export const createItinerary = async (itineraryData) => {
    const response = await axios.post("/itinerary/create", itineraryData);
    return response.data;
};

// Get Itinerary by Trip ID
export const getItinerary = async (tripID) => {
    const response = await axios.get(`/itinerary/${tripID}`);
    return response.data;
};

// Update Itinerary
export const updateItinerary = async (tripID, itineraryData) => {
    const payload = {
        tripID: tripID,
        days: itineraryData.days
    };
    const response = await axios.put(`/itinerary/${tripID}`, payload);
    return response.data;
};

// Delete Itinerary
export const deleteItinerary = async (tripID) => {
    const response = await axios.delete(`/itinerary/${tripID}`);
    return response.data;
};