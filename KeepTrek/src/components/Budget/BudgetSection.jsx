import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Droplet, Bike, Home, Waves, Wine, UserPlus, DollarSign, Users, UserCog, ShoppingBag } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useBudget } from './BudgetContext';


export default function BudgetSection() {
  const {
    expenses,
    users,
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
    calculateNetBalance
  } = useBudget();

  const typeIcons = {
    Food: <Utensils className="w-6 h-6" />,
    Activity: <Bike className="w-6 h-6" />,
    Stay: <Home className="w-6 h-6" />,
    Transport: <Waves className="w-6 h-6" />,
    Shopping: <ShoppingBag className="w-6 h-6" />,
    Other: <DollarSign className="w-6 h-6" />
  };
  
  
  
  // Local state for UI
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserSwitch, setShowUserSwitch] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    type: '',
    description: '',
    amount: '',
    paidBy: currentUser?.id || '',
    splits: [],
    splitMethod: 'equal'
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: ''
  });

  // Get user's friends for the current user
  const userFriends = currentUser ? getUserFriends(currentUser.id) : [];

  const [isOpen, setIsOpen] = useState(false);
  // const [form, setForm] = useState({
  //   date: new Date().toISOString().split("T")[0],
  //   type: "Food",
  //   description: "",
  //   amount: "",
  //   paidBy: "",
  // });

  // Initialize data from local storage or JSON files
  

  // Database operations
  

  // Calculate balances
  const calculateBalances = () => {
    if (!currentUser) return {};
  
    const balances = {};
    const userFriends = getUserFriends(currentUser.id);
  
    userFriends.forEach((friend) => {
      balances[friend.id] = 0;
    });
  
    getUserExpenses(currentUser.id).forEach((expense) => {
      if (expense.paidBy === currentUser.id) {
        // Current user paid
        expense.splits.forEach((split) => {
          if (split.friendId !== currentUser.id) {
            balances[split.friendId] += split.amount;
          }
        });
      } else {
        // Someone else paid
        const currentUserSplit = expense.splits.find(
          (split) => split.friendId === currentUser.id
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
    addUser(newUser);
    setNewUser({ name: '', email: '' });
    setShowAddUser(false);
  };

  // Event handlers
  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.type) {
      alert("Please fill all required fields");
      return;
    }

    let splits;
    if (newExpense.splitMethod === "equal") {
      const splitAmount = Number(newExpense.amount) / (userFriends.length + 1);
      splits = [
        { friendId: currentUser.id, amount: splitAmount },
        ...userFriends.map(friend => ({
          friendId: friend.id,
          amount: splitAmount
        }))
      ];
    } else {
      splits = newExpense.splits;
    }

    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: Number(newExpense.amount),
      splits
    };

    addExpense(expense);
    setShowAddExpense(false);
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      type: '',
      description: '',
      amount: '',
      paidBy: currentUser.id,
      splits: [],
      splitMethod: 'equal'
    });
  };

  const balances = calculateBalances();


  if (!currentUser) return <div>Loading...</div>;

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
    setIsExpenseModalOpen(true);
  };
  
  const handleCloseExpenseModal = () => {
    setSelectedExpense(null);
    setIsExpenseModalOpen(false);
  };
  const handleEditExpense = (updatedExpense) => {
    let updatedSplits = updatedExpense.splits;
  
    if (updatedExpense.splitMethod === "equal") {
      const splitAmount =
        Number(updatedExpense.amount) / (userFriends.length + 1); // Include current user
      updatedSplits = [
        { friendId: currentUser.id, amount: splitAmount },
        ...userFriends.map((friend) => ({
          friendId: friend.id,
          amount: splitAmount,
        })),
      ];
    } else if (updatedExpense.splitMethod === "custom") {
      // Ensure custom splits are valid
      const totalCustomAmount = updatedExpense.splits.reduce(
        (sum, split) => sum + split.amount,
        0
      );
      if (totalCustomAmount > updatedExpense.amount) {
        alert("Custom split amounts exceed the total expense amount.");
        return; // Stop processing if invalid
      }
    } else if (updatedExpense.splitMethod === "percentage") {
      // Ensure percentage splits are valid
      const totalPercentage = updatedExpense.splits.reduce(
        (sum, split) => sum + split.percentage,
        0
      );
      if (totalPercentage > 100) {
        alert("Total percentage cannot exceed 100%.");
        return; // Stop processing if invalid
      }
      updatedSplits = updatedExpense.splits.map((split) => ({
        ...split,
        amount: (updatedExpense.amount * split.percentage) / 100,
      }));
    }
  
    const updatedExpenseWithSplits = { ...updatedExpense, splits: updatedSplits };
  
    const updatedExpenses = expenses.map((expense) =>
      expense.id === updatedExpenseWithSplits.id
        ? updatedExpenseWithSplits
        : expense
    );
  
    setExpenses(updatedExpenses);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    handleCloseExpenseModal(); // Close the modal after editing
  };
  
  const handleDeleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    handleCloseExpenseModal(); // Close the modal after deleting
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
          <h1 className="text-3xl font-bold">Expenses</h1>
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
                        switchUser(user.id);
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
      <Card className="mb-8">
        <div className="flex p-6 gap-6">
          <div className="bg-[#4DB6AC] text-white p-6 rounded-xl w-52 h-44 flex items-center justify-center">
            <div className="text-center">
            <span className="text-4xl font-bold block mb-1">RM {calculateTotalTripExpense().toFixed(2)} </span>
              <span className="text-2xl font-bold block mb-1">Total Trip Expense</span>
            </div>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="bg-[#E0F7FA] p-3 rounded-xl w-full h-20">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold block mb-1">Your Expense</span>
                <span className="text-2xl font-bold block mb-1">RM {calculateYourExpense().toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-[#E8F5E9] p-3 rounded-xl w-full h-20">
              <div className="flex justify-between items-center">
              <span className="text-2xl font-bold block mb-1">
      {calculateNetBalance() >= 0 ? "You Are Owed" : "You Owe"}
    </span>
    <span className="text-2xl font-bold block mb-1">
      RM {Math.abs(calculateNetBalance()).toFixed(2)}
    </span>
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
      {/* Add Expense Form */}
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={(e) =>
            setNewExpense({ ...newExpense, date: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select
          value={newExpense.type}
          onValueChange={(value) =>
            setNewExpense({ ...newExpense, type: value })
          }
        >
          <SelectTrigger className="w-full">
            {newExpense.type || "Select Type"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Activity">Activity</SelectItem>
            <SelectItem value="Stay">Stay</SelectItem>
            <SelectItem value="Transport">Transport</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
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
    {/* Remaining Display */}
    <p className="font-medium mb-2">
      Remaining:{" "}
      {newExpense.splitMethod === "custom"
        ? `RM ${(newExpense.amount - newExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0)).toFixed(2)}`
        : `${(100 - newExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0)).toFixed(2)}%`}
    </p>

    {/* Alert if remaining amount/percentage is not zero */}
    {(newExpense.splitMethod === "custom" &&
      newExpense.amount - newExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
    (newExpense.splitMethod === "percentage" &&
      100 - newExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0) ? (
      <p className="text-red-600 text-sm">
        The full {newExpense.splitMethod === "custom" ? "amount" : "percentage"} must be allocated before saving.
      </p>
    ) : null}

    {/* Splits Input */}
    {[...userFriends, { id: currentUser.id, name: "You" }].map((friend) => (
      <div key={friend.id} className="flex items-center gap-4 mb-3">
        <span className="w-1/3">
          {friend.id === currentUser.id ? "You" : friend.name}:
        </span>
        <Input
          type="number"
          placeholder={
            newExpense.splitMethod === "custom" ? "Amount" : "Percentage"
          }
          value={
            newExpense.splits.find((split) => split.friendId === friend.id)
              ?.[
                newExpense.splitMethod === "custom"
                  ? "amount"
                  : "percentage"
              ] || ""
          }
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;

            // Update splits dynamically
            const updatedSplits = newExpense.splits.filter(
              (split) => split.friendId !== friend.id
            );
            updatedSplits.push({
              friendId: friend.id,
              [newExpense.splitMethod === "custom" ? "amount" : "percentage"]: value,
            });

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
  className={`mt-4 bg-[#4DB6AC] hover:bg-[#3B9B91] text-white w-full ${
    (newExpense.splitMethod === "custom" &&
      newExpense.amount - newExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
    (newExpense.splitMethod === "percentage" &&
      100 - newExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0)
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
  onClick={handleAddExpense}
  disabled={
    (newExpense.splitMethod === "custom" &&
      newExpense.amount - newExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
    (newExpense.splitMethod === "percentage" &&
      100 - newExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0)
  }
>
  Add Expense
</Button>
  </DialogContent>
</Dialog>
        </div>

        <div className="space-y-3">
  {getUserExpenses(currentUser.id).map((expense) => {
    const isCurrentUserPayer = expense.paidBy === currentUser.id;

    // Calculate total owed or owed by others
    const currentUserOwes = expense.splits.find(
      (split) => split.friendId === currentUser.id
    )?.amount || 0;

    const totalOwedToUser = expense.splits
      .filter((split) => split.friendId !== currentUser.id)
      .reduce((sum, split) => sum + split.amount, 0);

    return (
      <Card
        key={expense.id}
        className="p-4 cursor-pointer hover:shadow-lg"
        onClick={() => handleExpenseClick(expense)} // Open modal on click
      >
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
                {isCurrentUserPayer
                  ? "You"
                  : users.find((user) => user.id === expense.paidBy)?.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            {/* Total Amount */}
            <div className="font-semibold text-lg">RM {expense.amount.toFixed(2)}</div>
            {/* Conditional Display */}
            {isCurrentUserPayer ? (
              <div className="text-sm text-green-600">
                You are owed: RM {totalOwedToUser.toFixed(2)}
              </div>
            ) : (
              <div className="text-sm text-red-600">
                You owe: RM {currentUserOwes.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  })}

  {getUserExpenses(currentUser.id).length === 0 && (
    <div className="text-gray-600 text-center py-4">No expenses yet</div>
  )}

  
</div>
{/* Expense Modal */}

{isExpenseModalOpen && selectedExpense && (
  <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Expense Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            type="text"
            value={selectedExpense.description}
            disabled={selectedExpense.paidBy !== currentUser.id} // Disable if not payer
            onChange={(e) =>
              setSelectedExpense({ ...selectedExpense, description: e.target.value })
            }
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={selectedExpense.date}
            disabled={selectedExpense.paidBy !== currentUser.id} // Disable if not payer
            onChange={(e) =>
              setSelectedExpense({ ...selectedExpense, date: e.target.value })
            }
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select
            value={selectedExpense.type}
            disabled={selectedExpense.paidBy !== currentUser.id} // Disable if not payer
            onValueChange={(value) =>
              setSelectedExpense({ ...selectedExpense, type: value })
            }
          >
            <SelectTrigger className="w-full">
              {selectedExpense.type || "Select Type"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Activity">Activity</SelectItem>
              <SelectItem value="Stay">Stay</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input
            type="number"
            value={selectedExpense.amount}
            disabled={selectedExpense.paidBy !== currentUser.id} // Disable if not payer
            onChange={(e) =>
              setSelectedExpense({
                ...selectedExpense,
                amount: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>

        {/* Split Method */}
        <div>
          <label className="block text-sm font-medium mb-1">Split Method</label>
          <Select
            value={selectedExpense.splitMethod}
            disabled={selectedExpense.paidBy !== currentUser.id} // Disable if not payer
            onValueChange={(value) =>
              setSelectedExpense({
                ...selectedExpense,
                splitMethod: value,
                splits: [],
              })
            }
          >
            <SelectTrigger className="w-full">
              {selectedExpense.splitMethod || "Select Split Method"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equal">Split Equally</SelectItem>
              <SelectItem value="custom">Custom Split</SelectItem>
              <SelectItem value="percentage">Split by Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Splits */}
        {selectedExpense.splitMethod !== "equal" && (
  <div>
    {/* Remaining Display */}
    <p className="font-medium mb-2">
      Remaining:{" "}
      {selectedExpense.splitMethod === "custom"
        ? `RM ${(selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0)).toFixed(2)}`
        : `${(100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0)).toFixed(2)}%`}
    </p>

    {/* Alert if remaining amount/percentage is not zero */}
    {(selectedExpense.splitMethod === "custom" &&
      selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
    (selectedExpense.splitMethod === "percentage" &&
      100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0) ? (
      <p className="text-red-600 text-sm">
        The full {selectedExpense.splitMethod === "custom" ? "amount" : "percentage"} must be allocated before saving.
      </p>
    ) : null}

    {/* Splits Input */}
    {[...userFriends, { id: currentUser.id, name: "You" }].map((friend) => (
      <div key={friend.id} className="flex items-center gap-4 mb-3">
        <span className="w-1/3">
          {friend.id === currentUser.id ? "You" : friend.name}:
        </span>
        <Input
          type="number"
          placeholder={
            selectedExpense.splitMethod === "custom" ? "Amount" : "Percentage"
          }
          value={
            selectedExpense.splits.find((split) => split.friendId === friend.id)
              ?.[
                selectedExpense.splitMethod === "custom"
                  ? "amount"
                  : "percentage"
              ] || ""
          }
          disabled={selectedExpense.paidBy !== currentUser.id} // Disable if not payer
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;

            // Update splits dynamically
            const updatedSplits = selectedExpense.splits.filter(
              (split) => split.friendId !== friend.id
            );
            updatedSplits.push({
              friendId: friend.id,
              [selectedExpense.splitMethod === "custom" ? "amount" : "percentage"]: value,
            });

            setSelectedExpense({ ...selectedExpense, splits: updatedSplits });
          }}
        />
      </div>
    ))}
  </div>
)}

        {/* Buttons */}
        {selectedExpense.paidBy === currentUser.id ? ( // Show buttons only for payer
          <div className="flex gap-4">
            <Button
  className={`bg-blue-500 hover:bg-blue-600 text-white ${
    (selectedExpense.splitMethod === "custom" &&
      selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
    (selectedExpense.splitMethod === "percentage" &&
      100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0)
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
  onClick={() => handleEditExpense(selectedExpense)}
  disabled={
    (selectedExpense.splitMethod === "custom" &&
      selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
    (selectedExpense.splitMethod === "percentage" &&
      100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0)
  }
>Save Changes
  
</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => handleDeleteExpense(selectedExpense.id)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <p className="text-gray-600">You do not have permission to edit this expense.</p>
        )}
      </div>
    </DialogContent>
  </Dialog>
)}


      </div>
    </div>
  );
}