import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { addExpense, getExpense, deleteExpense, updateExpense, totalTripExpense, totalUserExpense, UserBalance, getTripData } from '@/APIs/expenses';
import { balanceMap, settleDebt, getSettledDebts, editSettledDebt, deleteSettledDebt } from '@/APIs/settledDebts';
import { viewBudgets, editBudget, createBudget, deleteBudget } from '@/APIs/userBudgets';
import { useParams } from 'react-router-dom';
import { getTripMembers } from '@/APIs/trip';
import { useAuth } from '@/contexts/AuthProvider';

const ExpensesContext = createContext(null);

// Separate hook export
export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}

export function ExpensesProvider({ children }) {
  const { tripID } = useParams();
  const { user } = useAuth();

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
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [isLoadingDependent, setIsLoadingDependent] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Enhanced cache with more data
  const cache = useRef({
    mainData: null,
    expenses: null,
    settledDebts: null,
    balances: null,
    totals: null,
    lastFetch: null,
    CACHE_DURATION: 5 * 60 * 1000,
  });

  const isCacheValid = useCallback(() => {
    return cache.current.lastFetch && (Date.now() - cache.current.lastFetch) < cache.current.CACHE_DURATION;
  }, []);

  // Batch all initial data fetching into one call
  const fetchAllData = useCallback(async (showSkeleton = true) => {
    if (!tripID) return;

    try {
      if (showSkeleton) setIsLoadingMain(true);
      setError(null);

      const [userData, members, tripData] = await Promise.all([
        user,
        getTripMembers(tripID),
        getTripData(tripID),
      ]);

      // Map the data according to the exact API response structure
      const mappedData = {
        expenses: tripData.expenses || [],
        totals: {
          totalTrip: tripData.total_trip_expense || 0,
          totalUser: tripData.user_expense || 0,
          userBalance: tripData.user_balance || 0,
        },
        balances: tripData.adjusted_balance_map || {},
        settledDebts: tripData.settled_debts || [],
        budgets: tripData.budgets || [],
      };

      // Update cache
      cache.current = {
        ...cache.current,
        mainData: { user: userData, members },
        ...mappedData,
        lastFetch: Date.now(),
      };

      // Create username lookup
      const newUsernames = {};
      members.forEach((member) => {
        newUsernames[member.userID] = member.username;
      });

      // Batch state updates
      setTripMembers(members);
      setUsernames(newUsernames);
      setExpenses(mappedData.expenses);
      setSettledDebts(mappedData.settledDebts);
      setBalances(mappedData.balances);
      setTotals(mappedData.totals);
      setUserBudgets(mappedData.budgets);
      setIsInitialized(true);

      console.log('Fetched and updated data:', {
        balances: mappedData.balances,
        settledDebts: mappedData.settledDebts,
        expenses: mappedData.expenses
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      // Clear potentially stale data
      setExpenses([]);
      setSettledDebts([]);
      setBalances({});
      setTotals({
        totalTrip: 0,
        totalUser: 0,
        userBalance: 0,
      });
    } finally {
      if (showSkeleton) setIsLoadingMain(false);
    }
  }, [tripID, user]);

  // Use cached data or fetch fresh data
  useEffect(() => {
    if (!tripID) return;

    let isCancelled = false;

    const loadData = async () => {
      // Check if cache is valid
      if (isCacheValid()) {
        const { mainData, expenses, settledDebts, balances, totals } = cache.current;

        // Use cached data
        setTripMembers(mainData.members);
        setExpenses(expenses || []);
        setSettledDebts(settledDebts || []);
        setBalances(balances || {});
        setTotals(totals);
        setIsInitialized(true);
        return;
      }

      // Fetch fresh data if not cancelled
      if (!isCancelled) {
        await fetchAllData(true); // Only show skeleton on initial load
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [tripID, fetchAllData]);

  // Optimized refresh function
  const refreshData = useCallback(async (showSkeleton = false) => {
    // Clear cache
    cache.current = {
      ...cache.current,
      lastFetch: null,
    };
    await fetchAllData(showSkeleton);
  }, [fetchAllData]);

  // Button-level loading states
  const [isButtonLoading, setIsButtonLoading] = useState({
    create: false,
    edit: false,
    delete: false,
    settle: false,
  });

  // Replace individual refresh functions with the optimized one
  const createExpense = async (expenseData) => {
    setIsButtonLoading((prev) => ({ ...prev, create: true }));
    try {
      const newExpense = await addExpense(expenseData);
      await refreshData(false); // No skeleton after mutation
      return newExpense;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsButtonLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const removeExpense = async (expenseId, tripID) => {
    setIsButtonLoading((prev) => ({ ...prev, delete: true }));
    try {
      // Optimistically update UI
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
      await deleteExpense(expenseId, tripID);
      await refreshData(false);
    } catch (error) {
      await fetchAllData(false);
      throw error;
    } finally {
      setIsButtonLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const editExpense = async (expenseToUpdate) => {
    setIsButtonLoading((prev) => ({ ...prev, edit: true }));
    setLoading(true);
    try {
      const updatedExpense = await updateExpense(expenseToUpdate);
      await refreshData(false);
      return updatedExpense;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
      setIsButtonLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  const settleUp = async (debtData) => {
    setIsButtonLoading((prev) => ({ ...prev, settle: true }));
    setIsSettlingUp(true);
    try {
      if (!tripID) throw new Error('Trip ID is required');
      const result = await settleDebt(tripID, debtData);
      await refreshData(false);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsSettlingUp(false);
      setIsButtonLoading((prev) => ({ ...prev, settle: false }));
    }
  };

  // Edit settled debt function
  const editDebt = async (debtID, updatedAmount) => {
    setIsEditingDebt(true);
    try {
      if (!tripID || !debtID) {
        throw new Error('Missing required IDs');
      }
      const amount = Number(updatedAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
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

  const value = useMemo(
    () => ({
      user,
      expenses,
      tripMembers,
      totals,
      usernames,
      isLoading: loading || isLoadingUser || isLoadingExpenses || isLoadingTotals,
      isLoadingMain,
      isInitialized,
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
      isLoadingDependent,
      isButtonLoading,
    }),
    [
      user,
      expenses,
      tripMembers,
      totals,
      usernames,
      isLoadingUser,
      isLoadingExpenses,
      isLoadingTotals,
      isLoadingMain,
      isInitialized,
      error,
      balances,
      settledDebts,
      createExpense,
      refreshData,
      removeExpense,
      editExpense,
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
      isLoadingDependent,
      isButtonLoading,
    ]
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}