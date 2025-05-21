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
export const generateInviteLink = async (tripID, role) => {
  const response = await axios.get(`/trip/${tripID}/invite`, {
    params: { role }
  });
  return response.data;
}

export const joinTrip = async (inviteCode) => {
    try {
        const response = await axios.post(`/trip/join`, { 
            invite_code: inviteCode.trim() 
        });
        console.log('Join trip response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Join trip error:', error.response?.data);
        throw error;
    }
};

export const getTripMembers = async (tripID) => {
  const response = await axios.get(`/trip/${tripID}/users`);
  return response.data;
}

export const updateMemberRole = async (tripID, userID, newRole) => {
    try {
        console.log('Updating member role:', { tripID, userID, newRole });
        const response = await axios.patch(`/trip/${tripID}/user/${userID}/role`, {
            role: newRole.toLowerCase() // Ensure role is lowercase to match backend
        });
        return response.data;
    } catch (error) {
        console.error('Update member role error:', error.response?.data);
        throw error;
    }
};

export const removeMember = async (tripID, userID) => {
    try {
        console.log('Removing member:', { tripID, userID });
        const response = await axios.delete(`/trip/${tripID}/user/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Remove member error:', error.response?.data);
        throw error;
    }
};

export const getInvitePreview = async (inviteCode) => {
    try {
        console.log('Fetching invite preview for code:', inviteCode);
        const response = await axios.get(`/trip/invite/${inviteCode}`);
        console.log('Invite preview response:', response.data);
        return {
            ...response.data,
            isMember: !!response.data.membership // Convert membership object to boolean
        };
    } catch (error) {
        console.error('Get invite preview error:', {
            status: error.response?.status,
            data: error.response?.data,
            error: error.message
        });
        throw error;
    }
};

export const deleteTrip = async (tripID) => {
    try {
        console.log('Deleting trip:', { tripID });
        const response = await axios.delete(`/trip/${tripID}`);
        console.log('Delete trip response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete trip error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

/**
 * Edit a trip's details
 * @param {string} tripID - The ID of the trip to edit
 * @param {Object} tripData - Data to update
 * @param {string} [tripData.tripName] - New trip name
 * @param {string} [tripData.location] - New location
 * @param {string|Date} [tripData.startDate] - New start date
 * @param {string|Date} [tripData.endDate] - New end date
 * @param {string} [tripData.image] - New image URL
 * @returns {Promise<Object>} Updated trip data
 */
export const editTrip = async (tripID, tripData) => {
    try {
        // Log the edit operation
        console.log('Editing trip:', { tripID, data: tripData });
        
        // Format dates if they are Date objects
        const formattedData = { ...tripData };
        if (formattedData.startDate instanceof Date) {
            formattedData.startDate = `${String(formattedData.startDate.getFullYear())}-${String(formattedData.startDate.getMonth() + 1).padStart(2, '0')}-${String(formattedData.startDate.getDate()).padStart(2, '0')}`;
        }
        if (formattedData.endDate instanceof Date) {
            formattedData.endDate = `${String(formattedData.endDate.getFullYear())}-${String(formattedData.endDate.getMonth() + 1).padStart(2, '0')}-${String(formattedData.endDate.getDate()).padStart(2, '0')}`;
        }

        console.log('Formatted trip data:', formattedData);
        
        // Make the API request
        const response = await axios.patch(`/trip/${tripID}/edit`, formattedData);
        
        // Log successful edit
        console.log('Edit trip response:', response.data);
        return response.data;
    } catch (error) {
        // Detailed error logging
        console.error('Edit trip error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // User-friendly error messages
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid trip data');
        } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to edit this trip');
        } else if (error.response?.status === 404) {
            throw new Error('Trip not found');
        } else {
            throw new Error('Failed to edit trip');
        }
    }
};



