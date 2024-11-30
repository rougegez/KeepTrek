import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SetBudgetDialog({ isOpen, onClose, userBudget, onBudgetChange, onSaveBudget }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Budget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            value={userBudget}
            onChange={onBudgetChange}
            placeholder="Enter budget amount"
            className="w-full"
          />
          <button
            className="bg-[#4DB6AC] text-white py-2 px-4 rounded w-full"
            onClick={onSaveBudget}
          >
            Save Budget
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}