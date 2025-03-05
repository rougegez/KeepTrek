import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { addExpense,
         getExpense, 
         deleteExpense, 
         updateExpense,
         totalTripExpense, 
         totalUserExpense, 
         UserBalance, 
         getTripData
        } 
         from '@/APIs/expenses';
import {balanceMap, 
  settleDebt,
  getSettledDebts, 
  editSettledDebt,
  deleteSettledDebt} 
  from '@/APIs/settledDebts';
import{ viewBudgets, editBudget, createBudget, deleteBudget } from '@/APIs/userBudgets';
import { useParams } from 'react-router-dom';
import { CurrentUser } from '@/APIs/auth';
import { getTripMembers } from '@/APIs/trip';

const ExpensesContext = createContext(null);

// Separate hook export
export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}
export function ExpensesProvider ({ children }) {
  const { tripID } = useParams();
  

  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [tripMembers, setTripMembers] = useState([]);
  const [totals, setTotals] = useState({
    totalTrip: 0,
    totalUser: 0,
    userBalance: 0,
  });
  const [usernames, setUsernames] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [isLoadingTotals, setIsLoadingTotals] = useState(false);
  const [balances, setBalances] = useState({});
  const [settledDebts, setSettledDebts] = useState([]);
  const [isSettlingUp, setIsSettlingUp] = useState(false);
  const [isEditingDebt, setIsEditingDebt] = useState(false);
  const [isDeletingDebt, setIsDeletingDebt] = useState(false);
  const [userBudgets, setUserBudgets] = useState([]);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false);
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [isLoadingDependent, setIsLoadingDependent] = useState(false);

  // Enhanced cache with more data
  const cache = useRef({
    mainData: null,
    expenses: null,
    settledDebts: null,
    balances: null,
    totals: null,
    lastFetch: null,
    CACHE_DURATION: 5 * 60 * 1000
  });

  const isCacheValid = useCallback(() => {
    return cache.current.lastFetch && 
           (Date.now() - cache.current.lastFetch) < cache.current.CACHE_DURATION;
  }, []);

  // Batch all initial data fetching into one call
  const fetchAllData = useCallback(async () => {
    if (!tripID) return;

    try {
      setIsLoadingMain(true);

      const [userData, members, tripData] = await Promise.all([
        CurrentUser(),
        getTripMembers(tripID),
        getTripData(tripID)
      ]);

      // Map the data according to the exact API response structure
      const mappedData = {
        expenses: tripData.expenses || [],
        totals: {
          totalTrip: tripData.total_trip_expense || 0,
          totalUser: tripData.user_expense || 0,
          userBalance: tripData.user_balance || 0
        },
        balances: tripData.adjusted_balance_map || {},
        settledDebts: tripData.settled_debts || [],
        budgets: tripData.budgets || []
      };

      // Update cache
      cache.current = {
        ...cache.current,
        mainData: { user: userData, members },
        ...mappedData,
        lastFetch: Date.now()
      };

      // Create username lookup
      const newUsernames = {};
      members.forEach(member => {
        newUsernames[member.userID] = member.username;
      });

      // Batch state updates with exact field names
      setUser(userData);
      setTripMembers(members);
      setUsernames(newUsernames);
      setExpenses(mappedData.expenses);
      setSettledDebts(mappedData.settledDebts);
      setBalances(mappedData.balances);
      setTotals(mappedData.totals);
      setUserBudgets(mappedData.budgets);

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setIsLoadingMain(false);
    }
  }, [tripID]);

  // Use cached data or fetch fresh data
  useEffect(() => {
    if (!tripID) return;

    let isCancelled = false;

    const loadData = async () => {
      // Check if cache is valid
      if (isCacheValid()) {
        const {
          mainData,
          expenses,
          settledDebts,
          balances,
          totals
        } = cache.current;

        // Use cached data
        setUser(mainData.user);
        setTripMembers(mainData.members);
        setExpenses(expenses || []);
        setSettledDebts(settledDebts || []);
        setBalances(balances || {});
        setTotals(totals);
        return;
      }

      // Fetch fresh data if not cancelled
      if (!isCancelled) {
        await fetchAllData();
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [tripID, fetchAllData]);

  // Optimized refresh function
  const refreshData = useCallback(async () => {
    // Clear cache
    cache.current = {
      ...cache.current,
      lastFetch: null
    };
    
    await fetchAllData();
  }, [fetchAllData]);

  // Replace individual refresh functions with the optimized one
  const createExpense = async (expenseData) => {
    try {
      const newExpense = await addExpense(expenseData);
      await refreshData(); // Refresh all data in one go
      return newExpense;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const removeExpense = async (expenseId, tripID) => {
    try {
      // Optimistically update UI
      setExpenses(prevExpenses => 
        prevExpenses.filter(expense => expense.id !== expenseId)
      );
  
      // Make API call
      await deleteExpense(expenseId, tripID);
  
      // Only fetch totals, skip fetching expenses again
      await refreshData();
      
    } catch (error) {
      // Rollback on error
      console.error('Error deleting expense:', error);
      await fetchAllData(); // Restore correct state
      throw error;
    }
  };

const editExpense = async (expenseToUpdate) => {
  setLoading(true);
  try {
    // Update the expense
    const updatedExpense = await updateExpense(expenseToUpdate);
    
    // Refresh the expense list and totals
    await refreshData();
    
    return updatedExpense;
  } catch (error) {
    console.error('Error updating expense:', error);
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};

const settleUp = async (debtData) => {
  setIsSettlingUp(true);
  try {
    if (!tripID) {
      throw new Error("Trip ID is required");
    }

    // Call the API
    const result = await settleDebt(tripID,  debtData);
    
   await refreshData();
    
    return result;
  } catch (error) {
    console.error('Error settling up:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsSettlingUp(false);
  }
};

// Edit settled debt function
const editDebt = async (debtID, updatedAmount) => {
  setIsEditingDebt(true);
  try {
    if (!tripID || !debtID) {
      throw new Error("Missing required IDs");
    }
    const amount = Number(updatedAmount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }
    await editSettledDebt(tripID, debtID, amount);
    await refreshData();
  } catch (error) {
    console.error('Error editing debt:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsEditingDebt(false);
  }
};

// Delete settled debt function
const deleteDebt = async (debtID) => {
  setIsDeletingDebt(true);
  try {
    await deleteSettledDebt(tripID, debtID);
    await refreshData();
  } catch (error) {
    console.error('Error deleting debt:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsDeletingDebt(false);
  }
};

const handleCreateBudget = async (userID, amount) => {
  setIsCreatingBudget(true);
  try {
    await createBudget(tripID, userID, amount);
    await refreshData();
  } catch (error) {
    console.error('Error creating budget:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsCreatingBudget(false);
  }
};

const handleEditBudget = async (userID, updatedAmount) => {
  setIsEditingBudget(true);
  try {
    await editBudget(tripID, userID, updatedAmount);
    await refreshData();
  } catch (error) {
    console.error('Error editing budget:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsEditingBudget(false);
  }
};

const handleDeleteBudget = async (userID) => {
  setIsDeletingBudget(true);
  try {
    await deleteBudget(tripID, userID);
    await refreshData();
  } catch (error) {
    console.error('Error deleting budget:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsDeletingBudget(false);
  }
};

  const value = useMemo(() => ({
    user,
    expenses,
    tripMembers,
    totals,
    usernames,
    isLoading: loading || isLoadingUser || isLoadingExpenses || isLoadingTotals,
    error,
    balances,
    settledDebts,
    createExpense,
    refreshData,
    removeExpense,
    editExpense,
    fetchBalanceMap: balances,
    fetchSettledDebts: settledDebts,
    settleUp,
    isSettlingUp,
    editDebt,
    deleteDebt,
    isEditingDebt,
    isDeletingDebt,
    userBudgets,
    isCreatingBudget,
    isEditingBudget,
    isDeletingBudget,
    handleCreateBudget,
    handleEditBudget,
    handleDeleteBudget,
    isLoadingDependent
  }), [
    user,
    expenses,
    tripMembers,
    totals,
    usernames,
    isLoadingUser,
    isLoadingExpenses,
    isLoadingTotals,
    error,
    balances,
    JSON.stringify(settledDebts),
    createExpense,
    refreshData,
    removeExpense,
    editExpense,
    settledDebts,
    settleUp,
    isSettlingUp,
    editDebt,
    deleteDebt,
    isEditingDebt,
    isDeletingDebt,
    userBudgets,
    isCreatingBudget,
    isEditingBudget,
    isDeletingBudget,
    handleCreateBudget,
    handleEditBudget,
    handleDeleteBudget,
    isLoadingDependent
  ]);

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};