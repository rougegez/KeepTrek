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
    const [settledDebts, setSettledDebts] = useState([]);

    // Backend API Base URL
    const API_URL = 'http://localhost:3001';

    // Initialize data from backend
    useEffect(() => {
        const initializeData = async () => {
            try {
                const [usersRes, groupsRes, expensesRes, settledDebtsRes] = await Promise.all([
                    fetch(`${API_URL}/users`).then((res) => (res.ok ? res.json() : [])),
                    fetch(`${API_URL}/groups`).then((res) => (res.ok ? res.json() : [])),
                    fetch(`${API_URL}/expenses`).then((res) => (res.ok ? res.json() : [])),
                    fetch(`${API_URL}/settledDebts`).then((res) => (res.ok ? res.json() : [])),
                ]);
    
                setUsers(usersRes);
                setGroups(groupsRes);
                setExpenses(expensesRes);
                setSettledDebts(settledDebtsRes); // Load settled debts into state
    
                // Set default current user and group if available
                if (usersRes.length > 0) {
                    setCurrentUser(usersRes[0]);
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
        if (!currentUser || !currentGroup) return 0; // Guard clauses
    
        // Get all expenses related to the current group (users in the current group)
        const groupUsers = currentGroup.members; // IDs of users in the group
        const relevantExpenses = expenses.filter((expense) => {
            // Check if the expense was paid by a user in the group (paidBy field)
            return groupUsers.includes(expense.paidBy);
        });
    
        console.log("Relevant expenses:", relevantExpenses); // Debug log
    
        // Sum up the user's split from each relevant expense
        return relevantExpenses.reduce((total, expense) => {
            const userSplit = expense.splits.find((split) => split.friendId === currentUser.id);
    
            if (userSplit) {
                console.log(`User ${currentUser.name} owes ${userSplit.amount} for expense ${expense.id}`); // Debug log
                return total + userSplit.amount;
            }
    
            return total;
        }, 0);
    };

const calculateYouOwe = () => {
    if (!currentUser || !currentGroup) return 0;

    const groupUsers = currentGroup.members;
    const relevantExpenses = expenses.filter((expense) =>
        groupUsers.includes(expense.paidBy)
    );

    console.log("Relevant expenses for you owe:", relevantExpenses); // Debug

    return relevantExpenses.reduce((total, expense) => {
        const userSplit = expense.splits.find((split) => split.friendId === currentUser.id);

        if (userSplit && expense.paidBy !== currentUser.id) {
            console.log(`${currentUser.name} owes ${userSplit.amount} for expense ${expense.id}`); // Debug
            return total + userSplit.amount;
        }
        return total;
    }, 0);
};

const calculateOwedToYou = () => {
    if (!currentUser || !currentGroup) return 0;

    const groupUsers = currentGroup.members;
    const relevantExpenses = expenses.filter((expense) =>
        groupUsers.includes(expense.paidBy)
    );

    console.log("Relevant expenses for owed to you:", relevantExpenses); // Debug

    return relevantExpenses.reduce((total, expense) => {
        if (expense.paidBy === currentUser.id) {
            return total + expense.splits.reduce((sum, split) => {
                if (split.friendId !== currentUser.id) {
                    console.log(`${split.friendId} owes ${split.amount} for expense ${expense.id}`); // Debug
                    return sum + split.amount;
                }
                return sum;
            }, 0);
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
        try {
            // Add the settlement record
            await addSettlement(fromUserId, toUserId, amount);
    
            console.log(`Recorded settlement of ${amount} from ${fromUserId} to ${toUserId}`);
        } catch (error) {
            console.error('Failed to settle debt:', error);
            throw new Error('Failed to settle debt. Please try again.');
        }
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
    const addSettlement = async (fromUserId, toUserId, amount) => {
        try {
            const settlement = {
                fromUserId,
                toUserId,
                amount,
                date: new Date().toISOString(),
            };
    
            // Save to database
            const response = await fetch(`${API_URL}/settledDebts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settlement),
            });
    
            if (!response.ok) {
                throw new Error('Failed to save settlement.');
            }
    
            const newSettlement = await response.json();
    
            // Update local state
            setSettledDebts((prev) => [...prev, newSettlement]);
    
        } catch (error) {
            console.error('Failed to add settlement:', error);
            throw new Error('Failed to add settlement. Please try again.');
        }
    };
    const fetchSettledDebts = async (groupId) => {
        try {
            const response = await fetch(`${API_URL}/settledDebts?groupId=${groupId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch settled debts.');
            }
            const data = await response.json();
            setSettledDebts(data); // Update the state
        } catch (error) {
            console.error('Failed to fetch settled debts:', error);
        }
    };
    const calculateRemainingDebts = () => {
        const dynamicDebts = calculateDynamicDebts(); // Assume you already have this function
    
        const remainingDebts = { ...dynamicDebts };
    
        settledDebts.forEach(({ fromUserId, toUserId, amount }) => {
            if (remainingDebts[fromUserId] && remainingDebts[fromUserId][toUserId]) {
                remainingDebts[fromUserId][toUserId] -= amount;
    
                // Ensure no negative debts
                if (remainingDebts[fromUserId][toUserId] < 0) {
                    remainingDebts[fromUserId][toUserId] = 0;
                }
            }
        });
    
        return remainingDebts;
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
        fetchSettledDebts,
        calculateRemainingDebts
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