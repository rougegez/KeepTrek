import axios from "./axiosConfig";

export const balanceMap = async (tripID) => {
    const response = await axios.get(`/settledDebts/adjusted-balance/${tripID}`);
    return response.data;
  };
  
  // Get settled debts for a trip
  export const getSettledDebts = async (tripID) => {
    try {
      const response = await axios.get(`/settledDebts/${tripID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settled debts:', error);
      throw error;
    }
  };
  
  // Settle a new debt
  export const settleDebt = async (tripID, debtData) => {
    try {
      const response = await axios.post(`settledDebts/${tripID}/settle-debt`, debtData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error settling debt:', error);
      throw error;
    }
  };
  
  // Edit settled debt
  export const editSettledDebt = async (tripID, debtID, updatedAmount) => {
    try {
      const response = await axios.put(
        `settledDebts/${tripID}/edit-settled-debt/${debtID}`, 
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
  // Delete settled debt
  export const deleteSettledDebt = async (tripID, debtID) => {
    try {
      const response = await axios.delete(
        `settledDebts/${tripID}/delete-settled-debt/${debtID}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting settled debt:', error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          throw new Error("Settled debt not found");
        }
      }
      throw error;
    }
  };