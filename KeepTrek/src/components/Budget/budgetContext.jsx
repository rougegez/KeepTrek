import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const BudgetContext = createContext();

export function BudgetProvider({ children }) {
    // State management
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentGroup, setCurrentGroup] = useState(null);

    // Backend API Base URL
    const API_URL = 'http://localhost:3001';

    // Initialize data from backend
    useEffect(() => {
        const initializeData = async () => {
            try {
                const [usersRes, groupsRes, expensesRes] = await Promise.all([
                    fetch(`${API_URL}/users`).then((res) => (res.ok ? res.json() : [])),
                    fetch(`${API_URL}/groups`).then((res) => (res.ok ? res.json() : [])),
                    fetch(`${API_URL}/expenses`).then((res) => (res.ok ? res.json() : [])),
                ]);

                setUsers(usersRes);
                setGroups(groupsRes);
                setExpenses(expensesRes);

                // Set default current user and group if available
                if (usersRes.length > 0) {
                    setCurrentUser(usersRes[0]);
                    // Assign the current group based on the first user (assuming they are assigned to the first group)
                    const userGroup = groupsRes.find(group => group.members.includes(usersRes[0].id));
                    setCurrentGroup(userGroup || null);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        initializeData();
    }, []);

    // Database operations
    const addExpense = async (expense) => {
        try {
            const response = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
            const newExpense = await response.json();
            setExpenses((prev) => [...prev, newExpense]);
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };

    const editExpense = async (updatedExpense) => {
      try {
          console.log('Editing expense with data:', updatedExpense); // Log the data being sent
  
          // Ensure all required fields are available in updatedExpense
          if (!updatedExpense.id || !updatedExpense.groupId || !updatedExpense.paidBy) {
              throw new Error('Missing necessary fields to edit the expense');
          }
  
          const response = await fetch(`${API_URL}/expenses/${updatedExpense.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedExpense),
          });
  
          // Check if the response is successful
          if (!response.ok) {
              console.error(`Failed to edit expense. Response status: ${response.status}`);
              const responseText = await response.text();
              console.error(`Server response: ${responseText}`);
              throw new Error('Failed to update expense in backend.');
          }
  
          const updatedExpenseFromServer = await response.json();
          console.log('Updated expense from server:', updatedExpenseFromServer);
  
          setExpenses((prev) =>
              prev.map((expense) =>
                  expense.id === updatedExpenseFromServer.id ? updatedExpenseFromServer : expense
              )
          );
  
      } catch (error) {
          console.error('Failed to edit expense:', error);
          alert('Failed to edit expense. Please try again.');
      }
  };
  

  const deleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        console.error("Failed to delete expense. Response status:", response.status);
        throw new Error("Failed to delete expense in backend.");
      }
  
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
    } catch (error) {
      console.error("Failed to delete expense:", error);
      throw new Error("Failed to delete expense.");
    }
  };

    const addUser = async (newUser) => {
        try {
            // Generate a unique ID for the new user
            const newUserId = crypto.randomUUID(); // Replace with any unique ID logic for testing
            const addedUser = { id: newUserId, ...newUser };

            // Save the new user to the backend
            const userResponse = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addedUser),
            });

            if (!userResponse.ok) {
                throw new Error('Failed to save new user to database.');
            }

            setUsers((prevUsers) => [...prevUsers, addedUser]);

            // If there is no group, create a default group
            if (!currentGroup) {
                const defaultGroupId = crypto.randomUUID();
                const defaultGroup = {
                    id: defaultGroupId,
                    name: 'Default Group',
                    members: [newUserId],
                };

                // Save the group to the backend
                const groupResponse = await fetch(`${API_URL}/groups`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(defaultGroup),
                });

                if (!groupResponse.ok) {
                    throw new Error('Failed to create default group.');
                }

                setGroups((prevGroups) => [...prevGroups, defaultGroup]);
                setCurrentGroup(defaultGroup);
            } else {
                // Update the existing group with the new user
                const updatedGroup = {
                    ...currentGroup,
                    members: [...currentGroup.members, newUserId],
                };

                // Save the updated group to the backend
                const groupResponse = await fetch(`${API_URL}/groups/${currentGroup.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedGroup),
                });

                if (!groupResponse.ok) {
                    throw new Error('Failed to update group with new user.');
                }

                setGroups((prevGroups) =>
                    prevGroups.map((group) =>
                        group.id === updatedGroup.id ? updatedGroup : group
                    )
                );
                setCurrentGroup(updatedGroup);
            }

            return addedUser;
        } catch (error) {
            console.error('Error adding user:', error);
            throw new Error('Failed to add user.');
        }
    };

    const switchUser = (userId) => {
        const user = users.find((u) => u.id === userId);
        if (user) {
            setCurrentUser(user);
            // Update current group based on the switched user
            const userGroup = groups.find(group => group.members.includes(userId));
            setCurrentGroup(userGroup || null);
        } else {
            console.warn(`User with ID ${userId} not found.`);
        }
    };

    const getUserExpenses = (userId) => {
        return expenses.filter(
            (expense) =>
                expense.paidBy === userId ||
                expense.splits.some((split) => split.friendId === userId)
        );
    };

    // Calculations
    const calculateTotalTripExpense = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const calculateYourExpense = () => {
        if (!currentUser) return 0; // Guard clause

        return expenses.reduce((total, expense) => {
            const userSplit = expense.splits.find(
                (split) => split.friendId === currentUser.id
            );
            return total + (userSplit ? userSplit.amount : 0);
        }, 0);
    };

    const calculateOwedToYou = () => {
        if (!currentUser) return 0; // Guard clause

        return expenses.reduce((total, expense) => {
            if (expense.paidBy === currentUser.id) {
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
        if (!currentUser) return 0; // Guard clause

        return expenses.reduce((total, expense) => {
            const currentUserSplit = expense.splits.find(
                (split) => split.friendId === currentUser.id
            );
            if (currentUserSplit && expense.paidBy !== currentUser.id) {
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

    const settleDebt = async (fromUserId, toUserId, amount) => {
        setExpenses((prevExpenses) => {
            return prevExpenses.map((expense) => {
                if (expense.paidBy === toUserId) {
                    const updatedSplits = expense.splits
                        .map((split) => {
                            if (split.friendId === fromUserId) {
                                const remainingAmount = split.amount - amount;
                                return remainingAmount > 0
                                    ? { ...split, amount: remainingAmount }
                                    : null;
                            }
                            return split;
                        })
                        .filter(Boolean); // Remove splits with zero amount

                    return { ...expense, splits: updatedSplits };
                }
                return expense;
            });
        });
    };
    const updateGroupBudget = async (userId, budget) => {
      if (!currentGroup) {
        throw new Error("No current group found");
      }
    
      const updatedGroup = {
        ...currentGroup,
        budgets: {
          ...currentGroup.budgets,
          [userId]: budget,
        },
      };
    
      try {
        const response = await fetch(`${API_URL}/groups/${currentGroup.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedGroup),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update group budget in backend.");
        }
    
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === updatedGroup.id ? updatedGroup : group
          )
        );
        setCurrentGroup(updatedGroup);
      } catch (error) {
        console.error("Error updating group budget:", error);
        throw error;
      }
    };

    const value = {
        expenses,
        users,
        groups,
        currentUser,
        currentGroup,
        addExpense,
        editExpense,
        deleteExpense,
        addUser,
        switchUser,
        getUserExpenses,
        calculateTotalTripExpense,
        calculateYourExpense,
        calculateOwedToYou,
        calculateYouOwe,
        calculateNetBalance,
        settleDebt,
        updateGroupBudget,
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