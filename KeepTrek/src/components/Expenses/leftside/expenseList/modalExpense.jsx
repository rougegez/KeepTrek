import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useExpenses } from '@/components/Expenses/expenseContext';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ModalExpense = ({ isOpen, onClose, selectedExpense, setSelectedExpense }) => {
    const { tripID } = useParams();
    const {
        expenses,
        tripMembers,
        user,
        removeExpense,
        editExpense,
        isButtonLoading
    } = useExpenses();

    const handleExpenseClick = (expense) => {
        setSelectedExpense(expense);
        setIsExpenseModalOpen(true);
    };
    
    const handleCloseExpenseModal = () => {
        setSelectedExpense(null);
        onClose();
    };
    const handleEditExpense = async (updatedExpense) => {
        try {
          // Validate splits and prepare the updated splits object
          let updatedSplits = updatedExpense.splits;
      
          // Check for split method and apply appropriate logic
          if (updatedExpense.splitMethod === "equal") {
            const splitAmount = Number((updatedExpense.amount / tripMembers.length).toFixed(2));
            updatedSplits = tripMembers.map(member => ({
              userID: member.userID,
              amount: splitAmount
            }));
          } else if (updatedExpense.splitMethod === "custom") {
            const totalCustomAmount = updatedSplits.reduce(
              (sum, split) => sum + (split.amount || 0),
              0
            );
            if (totalCustomAmount > updatedExpense.amount) {
              toast.info("Custom split amounts exceed the total expense amount.");
              return; // Stop processing if the validation fails
            }
          } else if (updatedExpense.splitMethod === "percentage") {
            const totalPercentage = updatedSplits.reduce(
              (sum, split) => sum + (split.percentage || 0),
              0
            );
            if (totalPercentage > 100) {
              toast.info("Total percentage cannot exceed 100%.");
              return; // Stop processing if the validation fails
            }
            updatedSplits = updatedSplits.map((split) => ({
              userID: split.userID,
              amount: (split.percentage / 100) * updatedExpense.amount,
            }));
          }
      
          // Create an expense object to be updated
          const expenseToUpdate = { ...updatedExpense, splits: updatedSplits };
      
          console.log("Editing expense with data:", expenseToUpdate);
      
      
          // Use the `editExpense` function from the context to update the backend
          await editExpense(expenseToUpdate);
      
          // Log success message if no error occurs
          console.log("Expense updated successfully!");
      
          // Close the expense modal after successful update
          handleCloseExpenseModal(); // Assuming you have this function defined to close the modal
        } catch (error) {
          console.error("Failed to edit expense:", error);
          toast.error("Failed to edit expense", {description : "Please try again"});
        }
      };
      const handleDeleteExpense = async () => {
        try {
            console.log("Deleting expense with ID:", selectedExpense.id, "from trip:", selectedExpense.tripID);
            
            await removeExpense(selectedExpense.id, selectedExpense.tripID);
            
            console.log("Expense deleted successfully!");
            handleCloseExpenseModal();
        } catch (error) {
            console.error("Failed to delete expense:", error);
            toast.error("Failed to delete expense", {description : "Please try again"});
        }
    };
    if (!selectedExpense) return null;

    

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-h-[80vh] w-full max-w-md sm:max-w-lg overflow-y-auto rounded-lg p-4">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  type="text"
                  value={selectedExpense.description}
                  disabled={selectedExpense.paidBy !== user}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, description: e.target.value })
                  }
                />
              </div>
    
              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={selectedExpense.date}
                  disabled={selectedExpense.paidBy !== user}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, date: e.target.value })
                  }
                />
              </div>
    
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select
                  value={selectedExpense.type}
                  disabled={selectedExpense.paidBy !== user}
                  onValueChange={(value) =>
                    setSelectedExpense({ ...selectedExpense, type: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    {selectedExpense.type || "Select Type"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Stay">Stay</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
    
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  type="number"
                  value={selectedExpense.amount}
                  disabled={selectedExpense.paidBy !== user}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
    
              {/* Split Method */}
              <div>
                <label className="block text-sm font-medium mb-1">Split Method</label>
                <Select
                  value={selectedExpense.splitMethod}
                  disabled={selectedExpense.paidBy !== user}
                  onValueChange={(value) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      splitMethod: value,
                      splits: [],
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    {selectedExpense.splitMethod || "Select Split Method"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Split Equally</SelectItem>
                    <SelectItem value="custom">Custom Split</SelectItem>
                    <SelectItem value="percentage">Split by Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
    
              {/* Splits */}
              {selectedExpense.splitMethod !== "equal" && (
                <div>
                  {/* Remaining Display */}
                  <p className="font-medium mb-2">
                    Remaining:{" "}
                    {selectedExpense.splitMethod === "custom"
                      ? `RM ${(selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0)).toFixed(2)}`
                      : `${(100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0)).toFixed(2)}%`}
                  </p>
    
                  {/* Alert if remaining amount/percentage is not zero */}
                  {(selectedExpense.splitMethod === "custom" &&
                    selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
                  (selectedExpense.splitMethod === "percentage" &&
                    100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0) ? (
                    <p className="text-red-600 text-sm">
                      The full {selectedExpense.splitMethod === "custom" ? "amount" : "percentage"} must be allocated before saving.
                    </p>
                  ) : null}
    
                  {/* Splits Input */}
                  {tripMembers.map((member) => (
                    <div key={member.userID} className="flex items-center gap-4 mb-3">
                        <span className="w-1/3">
                            {member.userID === user ? "You" : member.username}:
                        </span>
                        <Input
                            type="number"
                            placeholder={
                                selectedExpense.splitMethod === "custom" ? "Amount (RM)" : "Percentage (%)"
                            }
                            value={
                                selectedExpense.splitMethod === "custom"
                                    ? selectedExpense.splits.find((split) => split.userID === member.userID)
                                        ?.amount || ""
                                    : selectedExpense.splits.find((split) => split.userID === member.userID)
                                        ?.percentage || ""
                            }
                            onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                        
                                const updatedSplits = selectedExpense.splits.filter(
                                    (split) => split.userID !== member.userID
                                );
                        
                                if (selectedExpense.splitMethod === "percentage") {
                                    const currentTotalPercentage = updatedSplits.reduce(
                                        (sum, split) => sum + (split.percentage || 0),
                                        0
                                    );
                                    if (currentTotalPercentage + value > 100) {
                                        toast.info("Total percentage cannot exceed 100%.");
                                        return;
                                    }
                        
                                    updatedSplits.push({
                                        userID: member.userID,
                                        percentage: value,
                                        amount: (value / 100) * selectedExpense.amount,
                                    });
                                } else {
                                    updatedSplits.push({
                                        userID: member.userID,
                                        amount: value,
                                    });
                                }
                        
                                setSelectedExpense({ ...selectedExpense, splits: updatedSplits });
                            }}
                      />
                    </div>
                  ))}
                </div>
              )}
    
              {/* Buttons */}
              {selectedExpense.paidBy === user ? (
                <div className="flex gap-4">
                  <Button
                    className={`bg-blue-500 hover:bg-blue-600 text-white ${
                      (selectedExpense.splitMethod === "custom" &&
                        selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
                      (selectedExpense.splitMethod === "percentage" &&
                        100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleEditExpense(selectedExpense)}
                    disabled={
                      isButtonLoading?.edit ||
                      (selectedExpense.splitMethod === "custom" &&
                        selectedExpense.amount - selectedExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
                      (selectedExpense.splitMethod === "percentage" &&
                        100 - selectedExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0)
                    }
                  >
                    {isButtonLoading?.edit ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                    Save Changes
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    variant="destructive" 
                    onClick={handleDeleteExpense}
                    disabled={isButtonLoading?.delete}
                  >
                    {isButtonLoading?.delete ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                    Delete
                  </Button>
                </div>
              ) : (
                <p className="text-gray-600">You do not have permission to edit this expense.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    };
export default ModalExpense;