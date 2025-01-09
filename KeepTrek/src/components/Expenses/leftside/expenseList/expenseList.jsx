import { useExpenses } from '@/components/Expenses/expenseContext';
import { Utensils, Droplet, Bike, Home, Waves, DollarSign, ShoppingBag } from "lucide-react";
import React, { useMemo, useState } from 'react';
import { Card } from "@/components/ui/card";
import {ModalExpense} from '../expenseList/modalExpense';
import { useParams } from "react-router-dom";


export const ExpenseList = () => {
  const { tripID } = useParams();
  const {
    expenses,
    user,
    usernames,
    isLoadingExpenses,
    error,
  } = useExpenses();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  if (isLoadingExpenses) {
    return <div>Loading...</div>;
  }

  const typeIcons = useMemo(() => ({
    Food: <Utensils className="w-6 h-6" />,
    Activity: <Bike className="w-6 h-6" />,
    Stay: <Home className="w-6 h-6" />,
    Transport: <Waves className="w-6 h-6" />,
    Shopping: <ShoppingBag className="w-6 h-6" />,
    Other: <DollarSign className="w-6 h-6" />
  }), []);

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const isCurrentUserPayer = expense.paidBy === user;
        
        const currentUserOwes = expense.splits.find(
          (split) => split.userID === user
        )?.amount || 0;

        const totalOwedToUser = expense.splits
          .filter((split) => split.userID !== user)
          .reduce((sum, split) => sum + split.amount, 0);

        return (
          <Card
            key={expense.id}
            className="p-4 cursor-pointer hover:shadow-lg"
            onClick={() => handleExpenseClick(expense)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-2 rounded-full size-16 flex items-center justify-center">
                  {typeIcons[expense.type] || <Droplet className="w-6 h-6 text-gray-500" />}
                </div>
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    {expense.date} • Paid by {isCurrentUserPayer ? "You" : usernames[expense.paidBy] || "Unknown"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">
                  RM {expense.amount.toFixed(2)}
                </div>
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
      {isExpenseModalOpen && (
    <ModalExpense
        isOpen={isExpenseModalOpen}
        onClose={() => {
            setIsExpenseModalOpen(false);
            setSelectedExpense(null);  // Clear selected expense when closing
        }}
        selectedExpense={selectedExpense}
        setSelectedExpense={setSelectedExpense}
        tripID={tripID}
    />
)}
    </div>
    
    
  );
};

export default ExpenseList;