import axios from "./axiosConfig";

// Login API
export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);
  return response.data;
};

// Register API
export const registerUser = async (userData) => {
  const response = await axios.post("/users/register", userData);
  return response.data;
};