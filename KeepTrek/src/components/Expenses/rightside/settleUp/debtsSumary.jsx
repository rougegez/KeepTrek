import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useExpenses } from "@/components/Expenses/expenseContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/components/ui/loadingAnimation";
import { Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/profilePage/avatar";

// Add loading spinner component
const LoadingSpinner = () => (
  <Loader2 className="h-4 w-4 animate-spin" />
);

export default function DebtsSummary() {
  const {
    expenses,
    user,
    totalUser,
    tripMembers,
    balances,
    isLoadingMain,
    settledDebts,
    settleUp,
    editDebt,
    deleteDebt,
    isSettlingUp,
    usernames
  } = useExpenses();

  const { tripID } = useParams();
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editError, setEditError] = useState("");



  const handleSettleUp = async (paidBy, paidTo, amount) => {
    try {
      const debtData = {
        paidBy,
        paidTo,
        amount: parseFloat(amount)
      };
      await settleUp(debtData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  const handlePayClick = (userID, amount) => {
    setSelectedUser(userID);
    setPaymentAmount(Math.abs(amount).toString());
    setShowPayModal(true);
  };

  const handlePay = async () => {
    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        setPaymentError("Please enter a valid amount");
        return;
      }
      await handleSettleUp(user, selectedUser, amount);
      setShowPayModal(false);
      setPaymentError("");
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  // Add handlers
  const handleDebtClick = (debt) => {
    setSelectedDebt(debt);
    setEditAmount(debt.amount.toString());
    setShowEditModal(true);
  };

  const handleEditDebt = async () => {
    try {
      const amount = Number(editAmount);
      if (isNaN(amount) || amount <= 0) {
        setEditError("Please enter a valid amount");
        return;
      }

      console.log('Sending edit request:', {
        debtId: selectedDebt.id,
        amount: amount
      });
      
      await editDebt(selectedDebt.id, amount);
      setShowEditModal(false);
      setEditError("");
    } catch (error) {
      console.error('Error in handleEditDebt:', error);
      setEditError(error.message);
    }
  };

  const handleDeleteDebt = async () => {
    try {
      await deleteDebt(selectedDebt.id);
      setShowEditModal(false);
    } catch (error) {
      setEditError(error.message);
    }
  };

  const [error, setError] = useState(null);

  // Show skeleton loader during initial load
  if (isLoadingMain) {
    return (
      <div className="space-y-6 p-1">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  // Ensure settledDebts is always an array
  const debts = settledDebts || [];

  // Check for required data
  if (!user || !balances) {
    return <LoadingSkeleton />;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short'
    });
  };

  console.log('Balances:', balances); // Debugging log

  return (
    <div className="space-y-6 p-1">
      {/* Section: Users Who Owe You */}
      
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
                  <UserAvatar 
                    userId={userID}
                    className="h-8 w-8"
                  />
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
     

      {/* Section: Users You Owe */}
      
        <h2 className="text-xl font-bold mb-4 text-gray-800">Users You Owe</h2>
        {youOweUsers.length === 0 ? (
          <p className="text-gray-600">You don't owe any users money.</p>
        ) : (
          <ul className="space-y-4">
            {youOweUsers.map(([userID, amount]) => (
              <li
                key={userID}
                className="flex justify-between items-center p-3 hover:bg-gray-300 cursor-pointer transition-colors duration-200 rounded-lg"
                onClick={() => handlePayClick(userID, amount)}
              >
                <div className="flex items-center gap-4">
                  <UserAvatar 
                    userId={userID}
                    className="h-8 w-8"
                  />
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
      

      {/* Settled Debts Card */}
    
      <h2 className="text-xl font-bold mb-4 text-gray-800">Settled Debts</h2>
      {debts.length === 0 ? (
        <p className="text-gray-600">No settled debts yet.</p>
      ) : (
        <ul className="space-y-4">
          {debts.map((debt) => (
            <li
              key={debt.id}
              className={`flex justify-between items-center p-3 ${
                debt.paidBy === user ? 'hover:bg-gray-300 cursor-pointer' : ''
              } transition-colors duration-200 rounded-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-300 w-12 h-12 rounded-full flex flex-col items-center justify-center">
                  <span className="text-base text-[20px] font-bold text-gray-700 leading-none">
                    {String(new Date(debt.timestamp).getDate()).padStart(2, '0')}
                  </span>
                  <span className="text-[14px] font-medium text-gray-600">
                    {new Date(debt.timestamp).toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                </div>
                <span className="text-gray-800">
                  <span className="font-medium">{usernames[debt.paidBy]}</span>
                  {" paid "}
                  <span className="font-medium">{usernames[debt.paidTo]}</span>
                </span>
              </div>
              <span className="text-gray-700 font-medium">
                RM {debt.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    
    <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay {selectedUser ? getUserName(selectedUser) : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Pay (RM)
              </label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>
            {paymentError && (
              <p className="text-red-500 text-sm">{paymentError}</p>
            )}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPayModal(false)}>
                Cancel
              </Button>
              <Button onClick={handlePay} disabled={isSettlingUp}>
              {isSettlingUp ? <LoadingSpinner /> : 'Pay'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Settled Debt</DialogTitle>
    </DialogHeader>
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (RM)
        </label>
        <Input
          type="number"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          min="0"
          step="0.01"
          className="w-full"
        />
      </div>
      {editError && (
        <p className="text-red-500 text-sm">{editError}</p>
      )}
      <div className="flex justify-end space-x-3">
        <Button
          variant="destructive"
          onClick={handleDeleteDebt}
        >
          Delete
        </Button>
        <Button onClick={handleEditDebt}>
          Save Changes
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}