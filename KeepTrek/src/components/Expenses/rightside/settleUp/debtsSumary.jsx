import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExpenses } from "@/components/Expenses/expenseContext";
import { balanceMap } from '@/APIs/expenses';

export default function DebtsSummary() {
  const {
    expenses,
    user,
    totalUser,
    tripMembers,
    balances,
    isLoading,
    settledDebts,
  } = useExpenses();

  const [error, setError] = useState(null);

  // Check for loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check for required data
  if (!user || !balances) {
    return <div>Loading user data...</div>;
  }

  // Check for errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Safely access balances with null checks
  const userBalances = (balances && balances[user]) || {};
  const usersOweYou = Object.entries(userBalances || {}).filter(([_, amount]) => amount > 0) || [];
  const youOweUsers = Object.entries(userBalances || {}).filter(([_, amount]) => amount < 0) || [];

  const getUserName = (userID) => {
    if (!userID) return 'Unknown User';
    if (userID === user) return "You";
    const member = tripMembers?.find(member => member.userID === userID);
    return member ? member.username : 'Unknown User';
  };

  const totalUsersOweYou = usersOweYou.reduce((sum, [_, amount]) => sum + amount, 0);
  const totalYouOweUsers = youOweUsers.reduce((sum, [_, amount]) => sum + amount, 0);

  console.log(settledDebts);

  return (
    <div className="space-y-6 p-6">
      {/* Section: Users Who Owe You */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Users Who Owe You</h2>
        {usersOweYou.length === 0 ? (
          <p className="text-gray-600">No users owe you money.</p>
        ) : (
          <ul className="space-y-4">
            {usersOweYou.map(([userID, amount]) => (
              <li
                key={userID}
                className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-sm text-gray-600">👤</span>
                  </div>
                  <span className="text-gray-800">
                    <span className="font-medium">{getUserName(userID)}</span> owes you
                  </span>
                </div>
                <span className="text-gray-800 font-semibold">
                  RM {amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-4">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-xl font-bold text-gray-900">
            RM {totalUsersOweYou.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Section: Users You Owe */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Users You Owe</h2>
        {youOweUsers.length === 0 ? (
          <p className="text-gray-600">You don't owe any users money.</p>
        ) : (
          <ul className="space-y-4">
            {youOweUsers.map(([userID, amount]) => (
              <li
                key={userID}
                className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-sm text-gray-600">👤</span>
                  </div>
                  <span className="text-gray-800">
                    You owe <span className="font-medium">{getUserName(userID)}</span>
                  </span>
                </div>
                <span className="text-gray-800 font-semibold">
                  RM {Math.abs(amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-4">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-xl font-bold text-gray-900">
            RM {Math.abs(totalYouOweUsers).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Settled Debts Card */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Settled Debts</h2>
      {!settledDebts || settledDebts.length === 0 ? (
        <p className="text-gray-600">No settled debts yet.</p>
      ) : (
        <ul className="space-y-4">
          {settledDebts.map((debt, index) => (
            <li
              key={`${debt.paidBy}-${debt.paidTo}-${index}`}
              className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-600">💰</span>
                </div>
                <span className="text-gray-800">
                  <span className="font-medium">{getUserName(debt.paidBy)}</span>
                  {" paid "}
                  <span className="font-medium">{getUserName(debt.paidTo)}</span>
                </span>
              </div>
              <span className="text-gray-700 font-medium">
                RM {debt.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}