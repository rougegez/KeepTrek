import React, { createContext, useContext, useState, useEffect } from 'react';

// Import JSON data
import usersData from './db/users.json';
import expensesData from './db/expenses.json';
import friendsData from './db/friends.json';

// Local Storage Keys
const EXPENSES_KEY = 'expenses';
const USERS_KEY = 'users';
const FRIENDS_KEY = 'friends';
const CURRENT_USER_KEY = 'current_user';

// Create Context
const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  // State management
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize data from local storage or JSON files
  useEffect(() => {
    const initializeData = () => {
      // Try to get data from localStorage first
      const storedExpenses = localStorage.getItem(EXPENSES_KEY);
      const storedUsers = localStorage.getItem(USERS_KEY);
      const storedFriends = localStorage.getItem(FRIENDS_KEY);
      const storedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
  
      // Initialize Local Storage if not present
      if (!storedUsers) localStorage.setItem(USERS_KEY, JSON.stringify(usersData.users));
      if (!storedExpenses) localStorage.setItem(EXPENSES_KEY, JSON.stringify(expensesData.expenses));
      if (!storedFriends) localStorage.setItem(FRIENDS_KEY, JSON.stringify(friendsData.friends));
  
      // Set state
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : expensesData.expenses);
      setUsers(storedUsers ? JSON.parse(storedUsers) : usersData.users);
      setFriends(storedFriends ? JSON.parse(storedFriends) : friendsData.friends);
      
      const usersToSet = storedUsers ? JSON.parse(storedUsers) : usersData.users;
      const currentUserToSet = storedCurrentUser 
        ? JSON.parse(storedCurrentUser) 
        : usersToSet[0];
      setCurrentUser(currentUserToSet);
    };
    
    initializeData();
  }, []);

  // Database operations
  const addExpense = (expense) => {
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    return expense;
  };

  const editExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
  };

  const deleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: users.length + 1
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  
    // Initialize friend relationships
    const newFriendship = {
      userId: newUser.id,
      friendIds: users.map(u => u.id)
    };
    const updatedFriends = [...friends, newFriendship];
    friends.forEach(f => {
      f.friendIds.push(newUser.id);
    });
    setFriends(updatedFriends);
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(updatedFriends));
  
    return newUser;
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  };

  const getUserFriends = (userId) => {
    const userFriends = friends.find(f => f.userId === userId);
    if (!userFriends) return [];
    return users.filter(user => userFriends.friendIds.includes(user.id));
  };

  const getUserExpenses = (userId) => {
    return expenses.filter(expense => 
      expense.paidBy === userId || 
      expense.splits.some(split => split.friendId === userId)
    );
  };

  // Calculations
  const calculateTotalTripExpense = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateYourExpense = () => {
    return expenses.reduce((total, expense) => {
      const userSplit = expense.splits.find(split => split.friendId === currentUser?.id);
      return total + (userSplit ? userSplit.amount : 0);
    }, 0);
  };

  const calculateOwedToYou = () => {
    return expenses.reduce((total, expense) => {
      if (expense.paidBy === currentUser?.id) {
        return total + expense.splits.reduce((sum, split) => {
          if (split.friendId !== currentUser.id) {
            return sum + split.amount;
          }
          return sum;
        }, 0);
      }
      return total;
    }, 0);
  };

  const calculateYouOwe = () => {
    return expenses.reduce((total, expense) => {
      const currentUserSplit = expense.splits.find(split => split.friendId === currentUser?.id);
      if (currentUserSplit && expense.paidBy !== currentUser?.id) {
        return total + currentUserSplit.amount;
      }
      return total;
    }, 0);
  };

  const calculateNetBalance = () => {
    const owedToYou = calculateOwedToYou();
    const youOwe = calculateYouOwe();
    return owedToYou - youOwe;
  };
  const settleDebt = (fromUserId, toUserId, amount) => {
    setExpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.paidBy === toUserId) {
          const updatedSplits = expense.splits.map((split) => {
            if (split.friendId === fromUserId) {
              const remainingAmount = split.amount - amount;
              return remainingAmount > 0
                ? { ...split, amount: remainingAmount }
                : null;
            }
            return split;
          }).filter(Boolean); // Remove splits with zero amount
  
          return { ...expense, splits: updatedSplits };
        }
        return expense;
      });
    });
  };

  const value = {
    expenses,
    users,
    friends,
    currentUser,
    addExpense,
    editExpense,
    deleteExpense,
    addUser,
    switchUser,
    getUserFriends,
    getUserExpenses,
    calculateTotalTripExpense,
    calculateYourExpense,
    calculateOwedToYou,
    calculateYouOwe,
    calculateNetBalance,
    settleDebt
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

// Custom hook to use budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};