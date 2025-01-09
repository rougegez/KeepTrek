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

export const updateUserProfile = async (username, email) => {
  console.log('Updating profile with:', { username, email });
  const token = localStorage.getItem("token"); // Log the payload
  try {
    const response = await axios.put(`/users/profile`, null ,{
      params: {username: username, // Send null if username is not provided
               email: email },
      headers: {
        'Content-Type': 'application/json'
      },
      // Send null if email is not provided
    });
    console.log('Profile updated:', response.data);
    return response.data;
  } catch (error) {
    // Handle errors and provide feedback similar to your other functions
    if (error.response) {
      console.error('Error response:', error.response.data);
      const { status, data } = error.response;
      if (status === 404) {
        throw new Error("User not found");
      } else if (status === 400) {
        throw new Error(data.detail || "Invalid user data");
      } else if (status === 422) {
        throw new Error(data.detail || "Invalid data format");
      }
    }
    throw new Error("Failed to update user profile");
  }
};