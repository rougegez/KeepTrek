import { useExpenses } from '../expenseContext';
import React from 'react';
import { Card } from "@/components/ui/card";
import { LoadingSkeleton } from '@/components/ui/loadingAnimation';
import { useMediaQuery } from 'react-responsive';

export const ExpensesTotals = () => {
  const {
    totals,
    isLoadingMain,
    error,
    balances,
    user,
  } = useExpenses();

  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  // Get the balance map for the current user
  const userBalanceMap = balances[user] || {};
  
  // Calculate totals from the balance_map
  const userBalances = Object.values(userBalanceMap).reduce((sum, amount) => sum + amount, 0);
  const totalOwedToYou = usersOweYou.reduce((sum, [_, amount]) => sum + amount, 0);
  const totalYouOwe = youOweUsers.reduce((sum, [_, amount]) => sum + amount, 0);

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  if (isLoadingMain) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={`flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6`}>
      <Card className="bg-[#4DB6AC] text-white p-4 sm:p-6 rounded-xl w-full sm:w-52 h-auto sm:h-44 flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl sm:text-4xl font-bold block mb-1">
            RM {totals.totalTrip?.toFixed(2) || '0.00'}
          </span>
          <span className="text-xl sm:text-2xl font-bold block mb-1">
            Total Trip Expense
          </span>
        </div>
      </Card>
      <div className="space-y-4 flex-1 flex flex-col justify-center w-full">
        <Card className="bg-[#E0F7FA] p-3 rounded-xl w-full h-auto sm:h-20">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center text-center sm:text-left">
            <span className="text-xl sm:text-2xl font-bold block mb-1 sm:mb-0">Your Expense</span>
            <span className="text-xl sm:text-2xl font-bold block">
              RM {totals.totalUser?.toFixed(2) || '0.00'}
            </span>
          </div>
        </Card>
        <Card className={`p-3 rounded-xl w-full h-auto sm:h-20 ${userBalances >= 0 ? 'bg-[#E8F5E9]' : 'bg-[#FF9C9C]'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center text-center sm:text-left">
            <span className="text-xl sm:text-2xl font-bold block mb-1 sm:mb-0">
              {userBalances >= 0 ? "You Are Owed" : "You Owe"}
            </span>
            <span className="text-xl sm:text-2xl font-bold block">
              RM {Math.abs(userBalances).toFixed(2)}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesTotals;

