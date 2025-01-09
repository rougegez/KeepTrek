import axios from "./axiosConfig";

// Cache for user profiles
const userProfileCache = new Map();

export const getUserProfile = async (userId) => {
  // Check cache first
  if (userProfileCache.has(userId)) {
    return userProfileCache.get(userId);
  }

  try {
    const response = await axios.get(`/users/profile/${userId}`, {
      timeout: 5000, // 5 second timeout
      retry: 2, // Retry twice
      retryDelay: 1000 // Wait 1 second between retries
    });
    
    // Cache the response
    userProfileCache.set(userId, response.data);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout:", error);
    } else {
      console.error("Error fetching user profile:", error);
    }
    throw error;
  }
};