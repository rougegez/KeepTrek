import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { addExpense,
         getExpense, 
         deleteExpense, 
         updateExpense,
         totalTripExpense, 
         totalUserExpense, 
         UserBalance, 
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

  const fetchUser = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const userData = await CurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.message);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const fetchBalanceMap = useCallback(async () => {
    try {
      const Mapdata = await balanceMap(tripID);
      setBalances(Mapdata);
    } catch (error) {
      console.error('Error fetching balance map:', error);
      setError(error.message);
    }
  }, [tripID]);

  const fetchSettledDebts = useCallback(async () => {
    try {
      const SettledData = await getSettledDebts(tripID);
      setSettledDebts(SettledData || []); // Ensure empty array if no data
    } catch (error) {
      console.error('Error fetching settled debts:', error);
      setError(error.message);
      setSettledDebts([]); // Set empty array on error
    }
  }, [tripID]);

  const fetchUserBudgets = useCallback(async () => {
    try {
      const budgets = await viewBudgets(tripID);
      setUserBudgets(budgets || []);  
      refreshTotals();
    } catch (error) {
      console.error('Error fetching user budgets:', error);
      setError(error.message);
    }
  }, [tripID]);

  const cache = useRef({
    mainData: null,
    totals: null,
    lastFetch: null,
    // Cache expires after 5 minutes
    CACHE_DURATION: 5 * 60 * 1000
  });

  const isCacheValid = useCallback(() => {
    return cache.current.lastFetch && 
           (Date.now() - cache.current.lastFetch) < cache.current.CACHE_DURATION;
  }, []);

  // Group related data fetches
  const fetchEssentialData = useCallback(async () => {
    if (!tripID) return;
    if (isCacheValid()) {
      return cache.current.mainData;
    }

    try {
      setIsLoadingMain(true);
      const [user, expenses, members] = await Promise.all([
        CurrentUser(),
        getExpense(tripID),
        getTripMembers(tripID)
      ]);

      const data = { user, expenses, members };
      cache.current.mainData = data;
      cache.current.lastFetch = Date.now();

      setUser(user);
      setExpenses(expenses);
      setTripMembers(members);

      // Create username lookup
      const newUsernames = {};
      members.forEach(member => {
        newUsernames[member.userID] = member.username;
      });
      setUsernames(newUsernames);

      return data;
    } catch (error) {
      console.error('Error fetching essential data:', error);
      setError(error.message);
    } finally {
      setIsLoadingMain(false);
    }
  }, [tripID, isCacheValid]);

  // Fetch dependent data after essential data
  const fetchDependentData = useCallback(async (essentialData) => {
  if (!tripID || !essentialData) return;

  try {
    setIsLoadingDependent(true);
    
    // Use Promise.allSettled instead of Promise.all to handle partial failures
    const results = await Promise.allSettled([
      Promise.all([
        totalTripExpense(tripID),
        totalUserExpense(tripID),
        UserBalance(tripID)
      ]),
      balanceMap(tripID),
      getSettledDebts(tripID),
      viewBudgets(tripID)
    ]);

    // Process results, using default values if any promise fails
    const [totalsResult, balancesResult, debtsResult, budgetsResult] = results;

    if (totalsResult.status === 'fulfilled') {
      const [totalTrip, totalUser, userBalance] = totalsResult.value;
      setTotals({
        totalTrip: totalTrip || 0,
        totalUser: totalUser || 0,
        userBalance: userBalance || 0
      });
    }

    if (balancesResult.status === 'fulfilled') {
      setBalances(balancesResult.value || {});
    }

    if (debtsResult.status === 'fulfilled') {
      setSettledDebts(debtsResult.value || []);
    }

    if (budgetsResult.status === 'fulfilled') {
      setUserBudgets(budgetsResult.value || []);
    }

  } catch (error) {
    console.error('Error fetching dependent data:', error);
    setError(error.message);
  } finally {
    setIsLoadingDependent(false);
  }
}, [tripID]);
  useEffect(() => {
    const fetchAllData = async () => {
      const essentialData = await fetchEssentialData();
      if (essentialData) {
        await fetchDependentData(essentialData);
      }
    };

    fetchAllData();
  }, [fetchEssentialData, fetchDependentData]);

  const createExpense = async (expenseData) => {
    setLoading(true);
    try {
      if (!expenseData.tripID) {
        throw new Error("Trip ID is required");
      }
      if (!expenseData.splits?.length) {
        throw new Error("Splits are required");
      }
      
      const newExpense = await addExpense(expenseData);
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);
      await refreshTotals();
      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
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
      await refreshTotals();
      
    } catch (error) {
      // Rollback on error
      console.error('Error deleting expense:', error);
      await fetchMainData(); // Restore correct state
      throw error;
    }
  };

const editExpense = async (expenseToUpdate) => {
  setLoading(true);
  try {
    // Update the expense
    const updatedExpense = await updateExpense(expenseToUpdate);
    
    // Refresh the expense list and totals
    await refreshTotals();
    
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
    
   await refreshTotals();
    
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
    await fetchSettledDebts();
    await refreshTotals();
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
    await fetchSettledDebts();
    await refreshTotals();
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
    await fetchUserBudgets();
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
    await fetchUserBudgets();
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
    await fetchUserBudgets();
  } catch (error) {
    console.error('Error deleting budget:', error);
    setError(error.message);
    throw error;
  } finally {
    setIsDeletingBudget(false);
  }
};



const refreshTotals = useCallback(async () => {
  try {
    // Clear cache to force fresh data
    cache.current = {
      mainData: null,
      totals: null,
      lastFetch: null
    };
    
    const essentialData = await fetchEssentialData();
    if (essentialData) {
      await fetchDependentData(essentialData);
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
    setError(error.message);
  }
}, [fetchEssentialData, fetchDependentData]);

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
    refreshTotals,
    removeExpense,
    editExpense,
    fetchBalanceMap,
    fetchSettledDebts,
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
    settledDebts,
    createExpense,
    refreshTotals,
    removeExpense,
    editExpense,
    fetchBalanceMap,
    fetchSettledDebts,
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
  ]);

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};