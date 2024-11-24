import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Droplet, Bike, Home, Waves, Wine, UserPlus, DollarSign, Users, UserCog } from "lucide-react"; // Ensure this is imported only once
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

// Import JSON data
import usersData from './db/users.json';
import expensesData from './db/expenses.json';
import friendsData from './db/friends.json';
// Local Storage Keys
const EXPENSES_KEY = 'expenses';
const USERS_KEY = 'users';
const FRIENDS_KEY = 'friends';
const CURRENT_USER_KEY = 'current_user';

export default function BudgetSection() {
  const typeIcons = {
    Food: <Utensils className="w-6 h-6" />,
    Activity: <Bike className="w-6 h-6" />,
    Stay: <Home className="w-6 h-6" />,
    Travel: <Waves className="w-6 h-6" />,
    Drinks: <Wine className="w-6 h-6" />,
  };
  
  // State management
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserSwitch, setShowUserSwitch] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    type: '',
    description: '',
    amount: '',
    paidBy: '',
    splits: [],
    splitMethod: 'equal'
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: ''
  });

  const [isOpen, setIsOpen] = useState(false);
  // const [form, setForm] = useState({
  //   date: new Date().toISOString().split("T")[0],
  //   type: "Food",
  //   description: "",
  //   amount: "",
  //   paidBy: "",
  // });

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
  
      // Set expenses
      const expensesToSet = storedExpenses ? JSON.parse(storedExpenses) : expensesData.expenses;
      setExpenses(expensesToSet);
  
      // Set users
      const usersToSet = storedUsers ? JSON.parse(storedUsers) : usersData.users;
      setUsers(usersToSet);
  
      // Set friends
      const friendsToSet = storedFriends ? JSON.parse(storedFriends) : friendsData.friends;
      setFriends(friendsToSet);
  
      // Set current user
      const currentUserToSet = storedCurrentUser 
        ? JSON.parse(storedCurrentUser) 
        : usersToSet[0];
      setCurrentUser(currentUserToSet);
      setNewExpense(prev => ({ ...prev, paidBy: currentUserToSet.id }));
    };
    
  
    initializeData();
  }, []);

  // Database operations
  const db = {
    // Add new expense
    addExpense: (expense) => {
      const updatedExpenses = [...expenses, expense];
      setExpenses(updatedExpenses);
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
      return expense;
    },

    // Add new user
    addUser: (user) => {
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
      const updatedFriends = [
        ...friends,
        newFriendship
      ];
      // Update existing users' friend lists
      friends.forEach(f => {
        f.friendIds.push(newUser.id);
      });
      setFriends(updatedFriends);
      localStorage.setItem(FRIENDS_KEY, JSON.stringify(updatedFriends));
    
      return newUser;
    },
    // Switch current user
    switchUser: (userId) => {
      const user = users.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        setNewExpense(prev => ({ ...prev, paidBy: user.id }));
      }
    },

    // Get user's friends
    getUserFriends: (userId) => {
      const userFriends = friends.find(f => f.userId === userId);
      if (!userFriends) return [];
      return users.filter(user => userFriends.friendIds.includes(user.id));
    },

    // Get user's expenses
    getUserExpenses: (userId) => {
      return expenses.filter(expense => 
        expense.paidBy === userId || 
        expense.splits.some(split => split.friendId === userId)
      );
  return filteredExpenses;
    }
  };

  // Calculate balances
  const calculateBalances = () => {
    if (!currentUser) return {};
    
    const balances = {};
    const userFriends = db.getUserFriends(currentUser.id);
    
    userFriends.forEach(friend => {
      balances[friend.id] = 0;
    });

    db.getUserExpenses(currentUser.id).forEach(expense => {
      if (expense.paidBy === currentUser.id) {
        // Current user paid
        expense.splits.forEach(split => {
          if (split.friendId !== currentUser.id) {
            balances[split.friendId] += split.amount;
          }
        });
      } else {
        // Someone else paid
        const currentUserSplit = expense.splits.find(
          split => split.friendId === currentUser.id
        );
        if (currentUserSplit) {
          balances[expense.paidBy] -= currentUserSplit.amount;
        }
      }
    });

    return balances;
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    db.addUser(newUser);
    setNewUser({ name: '', email: '' });
    setShowAddUser(false);
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.type) {
      alert("Please fill all required fields, including expense type.");
      return;
    }
  
    let splits;
    if (newExpense.splitMethod === 'equal') {
      const splitAmount = Number(newExpense.amount) / (db.getUserFriends(currentUser.id).length + 1);
      splits = [
        { friendId: currentUser.id, amount: splitAmount },
        ...db.getUserFriends(currentUser.id).map(friend => ({
          friendId: friend.id,
          amount: splitAmount
        }))
      ];
    } else if (newExpense.splitMethod === 'custom') {
      splits = newExpense.splits.map(split => ({
        friendId: split.friendId,
        amount: Number(split.amount)
      }));
    } else if (newExpense.splitMethod === 'percentage') {
      splits = newExpense.splits.map(split => ({
        friendId: split.friendId,
        amount: (Number(newExpense.amount) * split.percentage) / 100
      }));
    }
  
    const expense = {
      id: expenses.length + 1,
      ...newExpense, // Ensure type is included here
      amount: Number(newExpense.amount),
      date: new Date().toISOString().split("T")[0],
      splits
    };
  
    db.addExpense(expense);
  
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      type: '',
      description: '',
      amount: '',
      paidBy: currentUser.id,
      splits: [],
      splitMethod: 'equal'
    });
    setShowAddExpense(false);
  };

  const balances = calculateBalances();
  const userFriends = currentUser ? db.getUserFriends(currentUser.id) : [];

  if (!currentUser) return <div>Loading...</div>;


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleAddExpense = () => {
  //   const typeIcons = {
  //     Food: <Utensils className="w-6 h-6" />,
  //     Activity: <Bike className="w-6 h-6" />,
  //     Stay: <Home className="w-6 h-6" />,
  //     Travel: <Waves className="w-6 h-6" />,
  //     Drinks: <Wine className="w-6 h-6" />,
  //   };

  //   const randomValue = Math.floor(Math.random() * 90) + 10;

  //   const newExpense = {
  //     ...form,
  //     icon: typeIcons[form.type],
  //     amount: parseFloat(form.amount),
  //     youOwe: form.paidBy === "You" ? undefined : randomValue,
  //     youPaid: form.paidBy === "You" ? randomValue : undefined,
  //   };

  //   setExpenses((prev) => [...prev, newExpense]);
  //   setForm({
  //     date: new Date().toISOString().split("T")[0],
  //     type: "Food",
  //     description: "",
  //     amount: "",
  //     paidBy: "",
  //   });
  //   setIsOpen(false);
  // };

  return (
    <div className="flex-[6] overflow-y-auto p-8 max-h-full">
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Splitwise Clone</h1>
          <div className="flex items-center gap-4">
            <Dialog open={showUserSwitch} onOpenChange={setShowUserSwitch}>
              <DialogTrigger className="flex items-center bg-purple-500 text-white px-3 py-2 rounded-lg">
                <UserCog className="w-4 h-4 mr-1" /> Switch User
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Switch User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  {users.map(user => (
                    <button
                      key={user.id}
                      className={`w-full p-2 text-left rounded hover:bg-gray-100 ${
                        user.id === currentUser.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                      onClick={() => {
                        db.switchUser(user.id);
                        setShowUserSwitch(false);
                      }}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
              <DialogTrigger className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg">
                <UserPlus className="w-4 h-4 mr-1" /> Add User
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                  <button
                    className="w-full bg-green-500 text-white p-2 rounded"
                    onClick={handleAddUser}
                  >
                    Add User
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="text-lg font-medium">
              Current User: <span className="text-blue-600">{currentUser.name}</span>
            </div>
          </div>
        </div>
      <h2 className="text-2xl font-bold mb-6">Budget</h2>
      <Card className="mb-8">
        <div className="flex p-6 gap-6">
          <div className="bg-[#4DB6AC] text-white p-6 rounded-xl w-52 h-44 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold block mb-1">RM 1346</span>
              <span className="text-2xl font-bold block mb-1">Total Trip Expense</span>
            </div>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="bg-[#E0F7FA] p-3 rounded-xl w-full h-20">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold block mb-1">Your Expense</span>
                <span className="text-2xl font-bold block mb-1">RM 273</span>
              </div>
            </div>
            <div className="bg-[#E8F5E9] p-3 rounded-xl w-full h-20">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold block mb-1">You are owed:</span>
                <span className="text-2xl font-bold block mb-1">RM 751</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Expenses</h3>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4DB6AC] hover:bg-[#3B9B91] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="transition-all duration-600 scale-100 data-[state=closed]:scale-0">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                  <Input type="date" name="date"  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}/>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select
                  value={newExpense.type}
                  onValueChange={(value) => setNewExpense({ ...newExpense, type: value })}
                >
                  <SelectTrigger className="w-full">
                    {newExpense.type || "Select Type"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Stay">Stay</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input type="text" name="description" value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (RM)</label>
                  <Input type="text" name="amount" value={newExpense.amount} 
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value.replace(/[^0-9.]/g, '')})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Paid By</label>
                  <Select value={newExpense.paidBy.toString()} 
                  onValueChange={(value) => setNewExpense({ ...newExpense, paidBy: Number(value) })}>
                    <SelectTrigger className="w-full">
                      {newExpense.paidBy
                        ? newExpense.paidBy === currentUser.id
                          ? `You (${currentUser.name})`
                          : users.find(user => user.id === newExpense.paidBy)?.name || "Select User"
                        : "Select User"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={currentUser.id.toString()}>You ({currentUser.name})</SelectItem>
                      {users
                        .filter((user) => user.id !== currentUser.id)
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Split Method</label>
                <Select
                  value={newExpense.splitMethod}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, splitMethod: value, splits: [] })
                  }
                >
                  <SelectTrigger className="w-full">
                    {newExpense.splitMethod || "Select Split Method"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Split Equally</SelectItem>
                    <SelectItem value="custom">Custom Split</SelectItem>
                    <SelectItem value="percentage">Split by Percentage</SelectItem>
                  </SelectContent>
                </Select>

                {newExpense.splitMethod !== "equal" && (
                  <div className="mt-4">
                    {userFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center gap-4 mb-3">
                        <span className="w-1/3 font-medium">{friend.name}:</span>
                        <input
                          type="number"
                          placeholder={
                            newExpense.splitMethod === "custom" ? "Amount" : "Percentage"
                          }
                          className="w-2/3 p-2 border rounded"
                          min={0}
                          max={newExpense.splitMethod === "percentage" ? 100 : undefined}
                          step="any"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            const updatedSplits = newExpense.splits.filter(
                              (split) => split.friendId !== friend.id
                            );
                            if (!isNaN(value) && value >= 0) {
                              updatedSplits.push({
                                friendId: friend.id,
                                [newExpense.splitMethod === "custom"
                                  ? "amount"
                                  : "percentage"]: value,
                              });
                            }
                            setNewExpense({ ...newExpense, splits: updatedSplits });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </form>
              <Button
                className="mt-4 bg-[#4DB6AC] hover:bg-[#3B9B91] text-white w-full"
                onClick={handleAddExpense}>
                Add Expense
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
        {db.getUserExpenses(currentUser.id).map((expense) => {

  return (
    <Card key={expense.id} className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Icon based on expense type */}
          <div className="bg-gray-100 p-2 rounded-full size-16 flex items-center justify-center">
            {typeIcons[expense.type] || <Droplet className="w-6 h-6 text-gray-500" />}
          </div>
          <div>
            <div className="font-medium">{expense.description}</div>
            <div className="text-sm text-gray-500">
              {expense.date} • Paid by{" "}
              {expense.paidBy === currentUser.id
                ? "You"
                : users.find((user) => user.id === expense.paidBy)?.name}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
})}
  {db.getUserExpenses(currentUser.id).forEach((expense) => {
  
})}
  {db.getUserExpenses(currentUser.id).length === 0 && (
    <div className="text-gray-600 text-center py-4">No expenses yet</div>
  )}
</div>
      </div>
    </div>
  );
}