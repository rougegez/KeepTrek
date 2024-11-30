import React from 'react';
import { Circle } from 'lucide-react';

export default function DebtsSummary({ debts, findUserById, onSettleUp }) {

    
  // Filter out debts with zero amount
  const filteredDebts = debts.filter(debt => Math.abs(debt.amount) > 0.01); // Using 0.01 to handle floating point precision
  
  const owedToUser = filteredDebts.filter((debt) => debt.amount < 0);
  const owedByUser = filteredDebts.filter((debt) => debt.amount > 0);

  const renderDebtItem = (debt, isOwedToUser) => {
    const user = findUserById(debt.friendId);
    const amount = Math.abs(debt.amount);
    
    // Don't render if amount is effectively zero
    if (amount < 0.01) return null;

    return (
      <div
        key={`${debt.friendId}-${amount}`}
        className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50"
        onClick={() => onSettleUp(debt)}
      >
        <div className="flex items-center gap-2">
          <Circle 
            className={`w-8 h-8 ${isOwedToUser ? 'text-[#4DB6AC]' : 'text-red-500'} fill-current`}
          />
          <span>
            {isOwedToUser 
              ? `${user?.name || "Unknown"} owes you`
              : `You owe ${user?.name || "Unknown"}`}
          </span>
        </div>
        <span className="font-semibold">
          RM {amount.toFixed(2)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Owed To You</h3>
        {owedToUser.map(debt => renderDebtItem(debt, true))}
        {owedToUser.length === 0 && (
          <div className="text-gray-500">No one owes you money</div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">You Owe</h3>
        {owedByUser.map(debt => renderDebtItem(debt, false))}
        {owedByUser.length === 0 && (
          <div className="text-gray-500">You don't owe anyone money</div>
        )}
      </div>
    </div>
  );
}