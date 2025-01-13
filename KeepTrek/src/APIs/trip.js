import axios from "./axiosConfig"; // Base Axios instance

// Create Trip
export const createTrip = async (tripData) => {
  const response = await axios.post("/trip/create", tripData);
  return response.data;
};

// Get Trip
export const getTrip = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}`);
  return response.data;
}

// List of trips
export const getUserTrips = async () => {
    const response = await axios.get("/trip/user-trips");
    return response.data;
  };

// Generate Invite Link
export const generateInviteLink = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}/invite`);
  return response.data;
}

export const joinTrip = async (inviteCode) => {
  const response = await axios.post(`/trip/join`, { invite_code: inviteCode });
  return response.data; 
}

export const getTripMembers = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}/users`);
  return response.data;
}

