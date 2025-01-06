import axios from "./axiosConfig"; // Base Axios instance

// Create Trip
export const createTrip = async (tripData) => {
  const response = await axios.post("/trip/create", tripData);
  return response.data;
};

export const getTrip = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}`);
  return response.data;
}

// Join Trip
export const joinTrip = async (tripID) => {
  const response = await axios.post(`/trip/join/${tripID}`);
  return response.data;
};

// List of trips
export const getUserTrips = async () => {
    const response = await axios.get("/trip/user-trips");
    return response.data;
  };

export const getTripMembers = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}/users`);
  return response.data;
}