import React, { useState } from 'react';
import { useExpenses } from '@/components/Expenses/expenseContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const BudgetProgress = () => {
  const { totalUser, user, userBudgets, handleCreateBudget, handleEditBudget, handleDeleteBudget } = useExpenses();
  const [showModal, setShowModal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Find user budget
  const userBudget = userBudgets.find(budget => budget.userID === user);
  const currentBudgetAmount = userBudget ? userBudget.amount : null;

  // Calculate progress percentage
  const percentage = currentBudgetAmount ? (totalUser / currentBudgetAmount) * 100 : 0;

  const handleOpenModal = () => {
    if (currentBudgetAmount) {
      setIsEditMode(true);
      setBudgetAmount(currentBudgetAmount.toString());
    } else {
      setIsEditMode(false);
      setBudgetAmount('');
    }
    setShowModal(true);
  };

  const handleSaveBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      if (isEditMode) {
        await handleEditBudget(user, amount);
      } else {
        await handleCreateBudget(user, amount);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await handleDeleteBudget(user);
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={totalUser > currentBudgetAmount ? "red" : "#4DB6AC"}
            strokeWidth="10"
            strokeDasharray={`${percentage * 2.83} 283`}
            transform="rotate(-90 50 50)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-2xl font-bold text-gray-500 cursor-pointer" onClick={handleOpenModal}>
            {currentBudgetAmount ? `RM ${totalUser.toFixed(2)}` : 'Set a Budget'}
          </div>
          {currentBudgetAmount && (
            <div className="text-sm text-gray-500 text-center">
              Spent of RM {currentBudgetAmount.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Amount (RM)
              </label>
              <Input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-3">
              {isEditMode && (
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBudget}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetProgress;