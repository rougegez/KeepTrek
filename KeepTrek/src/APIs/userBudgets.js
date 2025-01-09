import axios from "./axiosConfig";

// View budgets
export const viewBudgets = async (tripID) => {
    try {
      const response = await axios.get(`/userBudgets/${tripID}/budgets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  };
  
  // Create budget
  export const createBudget = async (tripID, userID, amount) => {
    try {
        console.log('Request payload:', { amount: amount });
      const response = await axios.post(
        `/userBudgets/${tripID}/create-budget/${userID}`,
        null,
        
        {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            amount: amount // Send as query parameter
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Server error details:', error.response?.data);
      const errorDetail = error.response?.data?.detail?.[0]?.msg;
      throw new Error(errorDetail || "Failed to edit debt");
    }
  };
  
  // Edit budget
  export const editBudget = async (tripID, userID, updatedAmount) => {
    try {
      console.log('Request payload:', { updated_amount: updatedAmount });
      const response = await axios.put(
        `/userBudgets/${tripID}/edit-budget/${userID}`,
        null, // No request body
        {
          params: {
            updated_amount: updatedAmount // Send as query parameter
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Server error details:', error.response?.data);
      const errorDetail = error.response?.data?.detail?.[0]?.msg;
      throw new Error(errorDetail || "Failed to edit debt");
    }
  };
  
  // Delete budget
  export const deleteBudget = async (tripID, userID) => {
    try {
      const response = await axios.delete(`/userBudgets/${tripID}/delete-budget/${userID}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };