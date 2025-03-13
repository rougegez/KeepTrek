import axios from "./axiosConfig";

// Cache for user profiles
const userProfileCache = new Map();

export const getUserProfile = async (userId) => {
  // Check cache first
  if (userProfileCache.has(userId)) {
    return userProfileCache.get(userId);
  }
    const response = await axios.get(`/users/profile/${userId}`, {
      timeout: 5000, // 5 second timeout
      retry: 2, // Retry twice
      retryDelay: 1000 // Wait 1 second between retries
    });
    
    // Cache the response
    userProfileCache.set(userId, response.data);
    return response.data;
};

export const updateUserProfile = async (updateData) => {
  try {
    const response = await axios.put(`/users/profile`, updateData);
    
    // Clear the cache when profile is updated
    userProfileCache.clear();
    return response.data;
  } catch (error) {
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

// Upload File
export const uploadFile = async (userId, fileData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axios.post(
      `/users/profile/${userId}/upload-file`,
      fileData,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      throw new Error("Unprocessable Entity: Invalid file data");
    }
    throw error;
  }
};

// Get All Files
export const getAllFiles = async (userId) => {
  const response = await axios.get(`/users/profile/${userId}/all-files`);
  return response.data;
};

// Get File URL
export const getFileURL = async (fileID) => {
  const response = await axios.get(`/users/profile/${fileID}/url`);
  return response.data;
};

// Delete File
export const deleteFile = async (userId, fileID) => {
  const response = await axios.delete(`/users/profile/${userId}/${fileID}/delete-file`);
  return response.data;
};
