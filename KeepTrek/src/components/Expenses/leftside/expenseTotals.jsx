import { useExpenses } from '../expenseContext';
import React from 'react';
import { Card } from "@/components/ui/card";
import {LoadingSkeleton} from '@/components/ui/loadingAnimation'; 

export const ExpensesTotals = () => {
  const {
    totals,
    isLoadingDependent,
    error,
    balances,
    user,
  } = useExpenses();
  const userBalances = balances[user] || {};
  const usersOweYou = Object.entries(userBalances).filter(([_, amount]) => amount > 0);
  const youOweUsers = Object.entries(userBalances).filter(([_, amount]) => amount < 0);
  const totalOwedToYou = usersOweYou.reduce((sum, [_, amount]) => sum + amount, 0);
  const totalYouOwe = youOweUsers.reduce((sum, [_, amount]) => sum + amount, 0);
  const userBalance = totalOwedToYou + totalYouOwe; // Add since totalYouOwe is already negative

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoadingDependent) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex p-6 gap-6">
      <div className="bg-[#4DB6AC] text-white p-6 rounded-xl w-52 h-44 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl font-bold block mb-1">
            RM {totals.totalTrip?.toFixed(2) || '0.00'}
          </span>
          <span className="text-2xl font-bold block mb-1">
            Total Trip Expense
          </span>
        </div>
      </div>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        <div className="bg-[#E0F7FA] p-3 rounded-xl w-full h-20">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold block mb-1">Your Expense</span>
            <span className="text-2xl font-bold block mb-1">
              RM {totals.totalUser?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
        <div className="bg-[#E8F5E9] p-3 rounded-xl w-full h-20">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold block mb-1">
              {(userBalance || 0) >= 0 ? "You Are Owed" : "You Owe"}
            </span>
            <span className="text-2xl font-bold block mb-1">
              RM {Math.abs(userBalance || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesTotals;