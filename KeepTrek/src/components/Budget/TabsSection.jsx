import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ExpenseBreakdown from "./ExpeneseBreakdown";
import { useBudget } from "./BudgetContext";

export default function TabsSection() {
  const {
    expenses,
    currentUser,
    currentGroup,
    users,
    settleDebt,
    updateGroup, // Function to update the group info from the backend
  } = useBudget();
  
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [userBudget, setUserBudget] = useState("");

  // Helper function to find a user by their ID
  const findUserById = (id) => users.find((user) => user.id === id);

  // Fetch the budget for the current user if available
  const currentUserBudget = currentGroup?.budgets?.[currentUser?.id] || 0;

  // Calculate user's total expenses so far
  const totalExpenses = useMemo(() => {
    if (!currentUser) return 0;
  
    return expenses
      .filter((expense) => currentGroup && expense.groupId === currentGroup.id) // Filter expenses only in the current group
      .reduce((total, expense) => {
        const userSplit = expense.splits.find((split) => split.friendId === currentUser.id);
        return total + (userSplit ? userSplit.amount : 0);
      }, 0);
  }, [expenses, currentUser, currentGroup]);
  
  // Calculate progress for the circular budget bar
  const progressPercentage = currentUserBudget > 0
    ? Math.min((totalExpenses / currentUserBudget) * 100, 100) // Cap at 100%
    : 0;
  

  // Handle budget setting and updating
  const handleEditBudget = async () => {
    if (!currentUser || !currentGroup) return;

    const updatedGroup = {
      ...currentGroup,
      budgets: {
        ...(currentGroup.budgets || {}),
        [currentUser.id]: parseFloat(userBudget) || 0,
      },
    };

    try {
      await updateGroup(updatedGroup); // Update the group in the context
      setIsBudgetModalOpen(false);
    } catch (error) {
      console.error("Failed to update budget:", error);
      alert("Failed to update budget. Please try again.");
    }
  };

  // Calculate total paid, reimbursed, and debts for the current group
  const { totalPaid, reimbursed, debts } = useMemo(() => {
    if (!currentUser || !currentGroup) return { totalPaid: 0, reimbursed: 0, debts: [] };

    let totalPaid = 0;
    let reimbursed = 0;
    const debtMap = {};

    // Filter expenses by current group
    const groupExpenses = expenses.filter(expense => expense.groupId === currentGroup.id);
    
    groupExpenses.forEach((expense) => {
      const { paidBy, splits } = expense;

      // Track total paid by the user
      if (paidBy === currentUser.id) {
        totalPaid += expense.amount;
        splits.forEach(({ friendId, amount }) => {
          if (friendId !== currentUser.id) {
            reimbursed += amount;
            debtMap[friendId] = (debtMap[friendId] || 0) - amount;
          }
        });
      } else {
        const userSplit = splits.find((split) => split.friendId === currentUser.id);
        if (userSplit) {
          debtMap[paidBy] = (debtMap[paidBy] || 0) + userSplit.amount;
        }
      }
    });

    // Cancel out debts
    const debts = Object.entries(debtMap)
      .map(([friendId, amount]) => ({ friendId: friendId, amount })) // friendId remains as a string
      .filter((debt) => debt.amount !== 0);

    return { totalPaid, reimbursed, debts };
  }, [expenses, currentUser, currentGroup]);

  // Separate debts into owed to user and owed by user
  const owedToUser = debts.filter((debt) => debt.amount < 0);
  const owedByUser = debts.filter((debt) => debt.amount > 0);

  const handleSettleUp = (debt) => {
    setSelectedDebt(debt);
    setPaymentAmount(Math.abs(debt.amount).toFixed(2));
  };

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);

    if (amount > 0 && amount <= Math.abs(selectedDebt.amount)) {
      const payerId =
        selectedDebt.amount > 0
          ? currentUser.id // You owe money, you pay
          : selectedDebt.friendId; // They owe you, they pay

      const payeeId =
        selectedDebt.amount > 0
          ? selectedDebt.friendId // You owe money to this user
          : currentUser.id; // They owe money to you

      settleDebt(payerId, payeeId, amount);
      setSelectedDebt(null);
      setPaymentAmount("");
    } else {
      alert("Invalid payment amount.");
    }
  };

  

  return (
    <div className="flex-[4] overflow-y-auto border-l p-8 max-h-full">
      <Tabs defaultValue="settle-up" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="settle-up">Settle Up</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Settle-Up Tab */}
        <TabsContent value="settle-up">
          <Card className="p-6">
            {/* Circular Progress */}
            <div className="flex justify-center mb-8">
  <div className="relative w-48 h-48">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={totalExpenses > currentUserBudget ? "red" : "#4DB6AC"}
        strokeWidth="10"
        strokeDasharray={`${progressPercentage * 2.83} 283`}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center flex-col">
      {currentUserBudget > 0 ? (
        <>
          <div className="text-2xl font-bold">RM {totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-gray-500 text-center">
            Spent of RM {currentUserBudget.toFixed(2)}
          </div>
        </>
      ) : (
        <div className="text-2xl font-bold text-gray-500 cursor-pointer" onClick={() => setIsBudgetModalOpen(true)}>
          Set a Budget
        </div>
      )}
    </div>
  </div>
</div>

            {/* Debts Summary */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Owed To You</h3>
                {owedToUser.map((debt, index) => {
                  const user = findUserById(debt.friendId);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSettleUp(debt)}
                    >
                      <div className="flex items-center gap-2">
                        <Circle className="w-8 h-8 text-[#4DB6AC] fill-current" />
                        <span>{user?.name || "Unknown"} owes you</span>
                      </div>
                      <span className="font-semibold">
                        RM {Math.abs(debt.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                {owedToUser.length === 0 && (
                  <div className="text-gray-500">No one owes you money</div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">You Owe</h3>
                {owedByUser.map((debt, index) => {
                  const user = findUserById(debt.friendId);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSettleUp(debt)}
                    >
                      <div className="flex items-center gap-2">
                        <Circle className="w-8 h-8 text-red-500 fill-current" />
                        <span>You owe {user?.name || "Unknown"}</span>
                      </div>
                      <span className="font-semibold">
                        RM {debt.amount.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                {owedByUser.length === 0 && (
                  <div className="text-gray-500">You don’t owe anyone money</div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown">
          <ExpenseBreakdown />
        </TabsContent>
      </Tabs>

      {/* Settle-Up Dialog */}
      {selectedDebt && (
        <Dialog open={Boolean(selectedDebt)} onOpenChange={() => setSelectedDebt(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settle Debt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                {selectedDebt.amount > 0
                  ? `You owe ${findUserById(selectedDebt.friendId)?.name}`
                  : `${findUserById(selectedDebt.friendId)?.name} owes you`}
                <span className="font-bold ml-1">RM {Math.abs(selectedDebt.amount).toFixed(2)}</span>
              </p>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) =>
                  setPaymentAmount(
                    Math.min(
                      Math.abs(selectedDebt.amount),
                      parseFloat(e.target.value || 0)
                    )
                  )
                }
                placeholder="Enter amount"
                className="w-full"
              />
              <button
                className="bg-[#4DB6AC] text-white py-2 px-4 rounded w-full"
                onClick={handlePayment}
                disabled={
                  parseFloat(paymentAmount) <= 0 ||
                  parseFloat(paymentAmount) > Math.abs(selectedDebt.amount)
                }
              >
                Pay
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Set Budget Dialog */}
      {isBudgetModalOpen && (
        <Dialog open={isBudgetModalOpen} onOpenChange={() => setIsBudgetModalOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Your Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="number"
                value={userBudget}
                onChange={(e) => setUserBudget(e.target.value)}
                placeholder="Enter budget amount"
                className="w-full"
              />
              <button
                className="bg-[#4DB6AC] text-white py-2 px-4 rounded w-full"
                onClick={handleEditBudget}
              >
                Save Budget
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}