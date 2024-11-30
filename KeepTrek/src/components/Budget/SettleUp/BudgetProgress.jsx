import React from 'react';

export default function BudgetProgress({ currentUserBudget, progressPercentage, onSetBudget,  calculateYourExpense }) {
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
            stroke={calculateYourExpense() > currentUserBudget ? "red" : "#4DB6AC"}
            strokeWidth="10"
            strokeDasharray={`${progressPercentage * 2.83} 283`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {currentUserBudget > 0 ? (
            <>
              <div className="text-2xl font-bold">RM {calculateYourExpense().toFixed(2)}</div>
              <div className="text-sm text-gray-500 text-center">
                Spent of RM {currentUserBudget.toFixed(2)}
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold text-gray-500 cursor-pointer" onClick={onSetBudget}>
              Set a Budget
            </div>
          )}
        </div>
      </div>
    </div>
  );
}