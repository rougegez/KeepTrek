import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SettleDebtDialog({ selectedDebt, findUserById, paymentAmount, onClose, onPaymentChange, onPayment }) {
  return (
    <Dialog open={Boolean(selectedDebt)} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle Debt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedDebt ? (selectedDebt.amount > 0
              ? `You owe ${findUserById(selectedDebt.friendId)?.name}`
              : `${findUserById(selectedDebt.friendId)?.name} owes you`) : ""}
            <span className="font-bold ml-1">RM {selectedDebt ? Math.abs(selectedDebt.amount).toFixed(2) : 0}</span>
          </p>
          <Input
            type="number"
            value={paymentAmount}
            onChange={onPaymentChange}
            placeholder="Enter amount"
            className="w-full"
          />
          <button
            className="bg-[#4DB6AC] text-white py-2 px-4 rounded w-full"
            onClick={onPayment}
            disabled={
              !selectedDebt ||
              parseFloat(paymentAmount) <= 0 ||
              parseFloat(paymentAmount) > Math.abs(selectedDebt?.amount || 0)
            }
          >
            Pay
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}