import axios from "./axiosConfig"; // Base Axios instance

// Add Expense (POST)
export const addExpense = async (expenseData) => {
  const response = await axios.post(`/expenses/${expenseData.tripID}`, expenseData);
  console.log('Data received in addExpense:', expenseData);
  return response.data;
};

export const updateExpense = async (expenseToUpdate) => {
  try {
    const response = await axios.put(
      `/expenses/${expenseToUpdate.id}`, 
      {
        tripID: expenseToUpdate.tripID,
        description: expenseToUpdate.description,
        amount: expenseToUpdate.amount,
        date: expenseToUpdate.date,
        type: expenseToUpdate.type,
        paidBy: expenseToUpdate.paidBy,
        splitMethod: expenseToUpdate.splitMethod,
        splits: expenseToUpdate.splits.map(split => ({
          userID: split.userID,
          amount: split.amount
        }))
      },
      {
        params: {
          trip_id: expenseToUpdate.tripID
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      const { status, data } = error.response;
      if (status === 404) {
        throw new Error("Trip or expense not found");
      } else if (status === 400) {
        throw new Error(data.detail || "Invalid expense data");
      } else if (status === 422) {
        throw new Error(data.detail || "Invalid data format");
      }
    }
    throw new Error("Failed to update expense");
  }
};

// Get Expenses for a Trip (GET)
export const getExpense = async (tripID) => {
  const response = await axios.get(`/expenses/${tripID}`);
  return response.data;
};

// delete Expenses for a Trip (DELETE)
export const deleteExpense = async (expenseId, tripID) => {
  try {
    const response = await axios.delete(`/expenses/${expenseId}`, {
      params: {
        trip_id: tripID
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 404) {
        throw new Error("Expense not found or does not belong to specified trip");
      }
    }
    throw new Error("Failed to delete expense");
  }
};

// Get Total Trip Expense (GET)
export const totalTripExpense = async (tripID) => {
  const response = await axios.get(`/expenses/totalTripExpense/${tripID}`);
  return response.data;
};

// Get Total User Expense (GET)
export const totalUserExpense = async (tripID) => {
  const response = await axios.get(`/expenses/userExpense/${tripID}`);
  return response.data;
};

// Get User Balance (GET)
export const UserBalance = async (tripID) => {
  const response = await axios.get(`/expenses/userBalance/${tripID}`);
  return response.data;
};

// Add new combined data fetch function
export const getTripData = async (tripID) => {
  const response = await axios.get(`/expenses/trip-data/${tripID}`);
  return response.data;
};


