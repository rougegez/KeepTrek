// SettleUp.jsx
import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import BudgetProgress from "./BudgetProgress";
import DebtsSummary from "./DebtsSummary";
import SettleDebtDialog from "./SettleDebtDialog";
import SetBudgetDialog from "./SettleBudgetDialog";
import { useBudget } from "../budgetContext";


export default function SettleUp() {

    
  const {
    expenses,
    currentUser,
    currentGroup,
    users,
    settleDebt,
    updateGroupBudget,
    calculateYourExpense,
    groups,
  } = useBudget();


  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [userBudget, setUserBudget] = useState("");

  const findUserById = (id) => users.find((user) => user.id === id);

  const currentUserBudget = currentGroup?.budgets?.[currentUser?.id] || 0;

  

  const progressPercentage = currentUserBudget > 0
    ? Math.min((calculateYourExpense() / currentUserBudget) * 100, 100)
    : 0;

    const handleEditBudget = async () => {
        if (!currentUser || !currentGroup) {
          alert("Please make sure you're in a group before setting a budget");
          return;
        }
    
        const budgetValue = parseFloat(userBudget);
        if (isNaN(budgetValue) || budgetValue < 0) {
          alert("Please enter a valid budget amount");
          return;
        }
    
        try {
          await updateGroupBudget(currentUser.id, budgetValue);
          setIsBudgetModalOpen(false);
          setUserBudget(""); // Reset the input after successful save
        } catch (error) {
          console.error("Failed to update budget:", error);
          alert(`Failed to update budget: ${error.message}`);
        }
      };

    const { totalPaid, reimbursed, debts } = useMemo(() => {
        
        if (!currentUser || !currentGroup) {
            return { totalPaid: 0, reimbursed: 0, debts: [] };
          }
        console.log('Current User:', currentUser?.id);
    console.log('Current Group:', currentGroup?.id);
    console.log('All Expenses:', expenses);


    let totalPaid = 0;
    let reimbursed = 0;
    const debtMap = {};

    // Filter the expenses that belong to the current group
    const groupExpenses = expenses.filter((expense) => {
        console.log('Checking expense:', expense); // Log each individual expense object
        console.log('Comparing:', expense.groupId, 'with', currentGroup.id); // Correctly log the current expense's groupId with the current group's id
        return expense.groupId === currentGroup.id;
      });

    groupExpenses.forEach((expense) => {
        const { paidBy, splits } = expense;
        console.log(`Processing expense ${expense.id} paid by ${paidBy}`); // Debugging

        // Case 1: The currentUser is the one who paid the expense
        if (paidBy === currentUser.id) {
            totalPaid += expense.amount;
            splits.forEach(({ friendId, amount }) => {
                if (friendId !== currentUser.id) {
                    reimbursed += amount;
                    debtMap[friendId] = (debtMap[friendId] || 0) - amount;
                }
            });
        } else {
            // Case 2: The currentUser owes money because someone else paid
            const userSplit = splits.find((split) => split.friendId === currentUser.id);
            if (userSplit) {
                debtMap[paidBy] = (debtMap[paidBy] || 0) + userSplit.amount;
            }
        }
    });

    console.log('Debt Map:', debtMap); // Debugging

    const debts = Object.entries(debtMap)
        .map(([friendId, amount]) => ({ friendId, amount }))
        .filter((debt) => debt.amount !== 0);

    console.log('Final Debts:', debts); // Debugging

    return { totalPaid, reimbursed, debts };
}, [expenses, currentUser, currentGroup, users, groups]);
    
   
  const handleSettleUp = (debt) => {
    if (debt) {
      setSelectedDebt(debt);
      setPaymentAmount(Math.abs(debt.amount).toFixed(2));
    }
  };
  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);

    if (amount > 0 && amount <= Math.abs(selectedDebt.amount)) {
      const payerId =
        selectedDebt.amount > 0 ? currentUser.id : selectedDebt.friendId;
      const payeeId =
        selectedDebt.amount > 0 ? selectedDebt.friendId : currentUser.id;

      settleDebt(payerId, payeeId, amount);
      setSelectedDebt(null);
      setPaymentAmount("");
    } else {
      alert("Invalid payment amount.");
    }
  };

  return (
    <TabsContent value="settle-up">
      <Card className="p-6">
        <BudgetProgress
          currentUserBudget={currentUserBudget}
          
          progressPercentage={progressPercentage}
          onSetBudget={() => setIsBudgetModalOpen(true)}
          calculateYourExpense={calculateYourExpense}
        />

        <DebtsSummary
          debts={debts}
          findUserById={findUserById}
          onSettleUp={handleSettleUp}
        />
      </Card>

      {/* Settle-Up Dialog */}
      <SettleDebtDialog
        selectedDebt={selectedDebt}
        findUserById={findUserById}
        paymentAmount={paymentAmount}
        onClose={() => setSelectedDebt(null)}
        onPaymentChange={(e) => setPaymentAmount(e.target.value)}
        onPayment={handlePayment}
      />

      {/* Set Budget Dialog */}
      <SetBudgetDialog
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        userBudget={userBudget}
        onBudgetChange={(e) => setUserBudget(e.target.value)}
        onSaveBudget={handleEditBudget}
      />
    </TabsContent>
  );
}