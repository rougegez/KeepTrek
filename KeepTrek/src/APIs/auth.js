import axios from "./axiosConfig";

// Login API
export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials,
    {headers: {
      'Content-Type': 'application/json'
    }}
  );
  return response.data;
};

// Register API
export const registerUser = async (userData) => {
  const response = await axios.post("/users/register", userData);
  return response.data;
};

export const CurrentUser = async () => {
  try {
    const response = await axios.get("/auth/currentUser"); // Ensure the route matches your backend
    return response.data; // Returns the user ID
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

export const getShortToken = async (type) => {
  try {
    const response = await axios.get(`/auth/shortToken?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch short token:", error);
    throw error;
  }
}