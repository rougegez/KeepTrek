import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef  } from 'react';
import { addExpense, getExpense, deleteExpense , updateExpense ,totalTripExpense, totalUserExpense, UserBalance, balanceMap, getSettledDebts } from '@/APIs/expenses';
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

  const cache = useRef({});

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

  const fetchMainData = useCallback(async () => {
    if (!tripID || cache.current.mainData?.tripID === tripID) return;

    try {
      const [expensesData, membersData] = await Promise.all([
        getExpense(tripID),
        getTripMembers(tripID),
      ]);

      setExpenses(expensesData);
      setTripMembers(membersData);

      const newUsernames = {};
      membersData.forEach(member => {
        newUsernames[member.userID] = member.username;
      });
      setUsernames(newUsernames);

      cache.current.mainData = { tripID, expensesData, membersData };
      
    } catch (error) {
      console.error('Error fetching main data:', error);
      setError(error.message);
    }
  }, [tripID]);

  const fetchTotals = useCallback(async () => {
    if (!tripID) return;

    try {
      setIsLoadingTotals(true);
      const [tripTotal, userTotal, balance] = await Promise.all([
        totalTripExpense(tripID),
        totalUserExpense(tripID),
        UserBalance(tripID),
      ]);

      setTotals({
        totalTrip: tripTotal,
        totalUser: userTotal,
        userBalance: balance,
      });
    } catch (error) {
      console.error('Error fetching totals:', error);
      setError(error.message);
    }finally{
      setIsLoadingTotals(false);

    }
  }, [tripID]);

  useEffect(() => {
    const fetchData = async () => {
      const userPromise = fetchUser();
      const mainDataPromise = fetchMainData();
      const totalsPromise = fetchTotals();
      const balancesPromise = fetchBalanceMap();
      const settledDebtsPromise = fetchSettledDebts(); 

      await Promise.allSettled([userPromise, mainDataPromise, totalsPromise, balancesPromise, settledDebtsPromise]);
    };

    fetchData();
  }, [fetchUser, fetchMainData, fetchTotals, fetchBalanceMap, fetchSettledDebts]);

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




  const refreshTotals = useCallback(async () => {
    await fetchTotals();
    await fetchMainData();
    await fetchBalanceMap();
    await fetchSettledDebts();
  }, [fetchTotals, fetchMainData, fetchBalanceMap, fetchSettledDebts]);

  const value = useMemo(() => ({
    user,
    expenses,
    tripMembers,
    ...totals,
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
  ]);

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};