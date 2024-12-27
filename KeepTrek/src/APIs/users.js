import axios from "./axiosConfig";

// Get user profile API
export const getUserProfile = async () => {
  const response = await axios.get("/users/profile");
  return response.data;
};