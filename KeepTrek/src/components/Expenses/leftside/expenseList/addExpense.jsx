import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useExpenses } from '@/components/Expenses/expenseContext';
import { toast } from "sonner";

export const AddExpense = () => {
    const { tripID } = useParams();
    
    const {
        user,
        tripMembers,
        createExpense,
        isButtonLoading
    } = useExpenses();
    const [showAddExpense, setShowAddExpense] = useState(false);      
    const [newExpense, setNewExpense] = useState({
        tripID: tripID || "",  // Make sure groupId is included initially
        date: new Date().toISOString().split("T")[0],
        type: "",
        description: "",
        amount: "",
        paidBy: user || "",
        splits: [],
        splitMethod: "equal",
    });

    React.useEffect(() => {
        setNewExpense(prev => ({
            ...prev,
            paidBy: user || "",
        }));
    }, [user]);
    const [isOpen, setIsOpen] = useState(false);

    const handleAddExpense = async () => {
        if (!newExpense.description || !newExpense.amount || !newExpense.type || !newExpense.paidBy) {
            toast.info("Please fill all required fields");
            return;
        }
        if (!tripID) {
            console.error("TripID is not defined!");
            toast.warning("TripID is missing. Please try again.");
            return;
        }

        try {
            const amount = parseFloat(newExpense.amount);
            if (amount < 0.01) {
                toast.info("Amount must be at least RM 0.01");
                return;
            }
            let splits = [];

            if (newExpense.splitMethod === "equal") {
                const splitAmount = Number((amount / tripMembers.length).toFixed(2));
                splits = tripMembers.map(member => ({
                    userID: member.userID,
                    amount: splitAmount
                }));
            } else if (newExpense.splitMethod === "custom" || newExpense.splitMethod === "percentage") {
                // Ensure all members have splits, assign 0 to those who don't
                splits = tripMembers.map(member => {
                    const split = newExpense.splits.find(split => split.userID === member.userID);
                    return split ? split : { userID: member.userID, amount: 0, percentage: 0 };
                });

                // For percentage splits, calculate actual amounts
                if (newExpense.splitMethod === "percentage") {
                    splits = splits.map(split => ({
                        userID: split.userID,
                        amount: Number(((split.percentage / 100) * amount).toFixed(2)),
                        percentage: split.percentage
                    }));
                }
            }

            const expenseData = {
                tripID: tripID,
                description: newExpense.description,
                amount: amount,
                type: newExpense.type,
                paidBy: newExpense.paidBy,
                splitMethod: newExpense.splitMethod,
                splits: splits,
                date: newExpense.date
            };

            console.log('Expense data being sent to createExpense:', expenseData);
            await createExpense(expenseData);
            setShowAddExpense(false); // Close the modal
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
                <Button className="bg-[#4DB6AC] hover:bg-[#3B9B91] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] w-full max-w-md sm:max-w-lg overflow-y-auto rounded-lg p-4">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                    {/* Add Expense Form */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input
                            type="date"
                            name="date"
                            value={newExpense.date}
                            onChange={(e) =>
                                setNewExpense({ ...newExpense, date: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select
                            value={newExpense.type}
                            onValueChange={(value) =>
                                setNewExpense({ ...newExpense, type: value })
                            }
                        >
                            <SelectTrigger className="w-full">
                                {newExpense.type || "Select Type"}
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Input type="text" name="description" value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (RM)</label>
                        <Input type="text" name="amount" value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value.replace(/[^0-9.]/g, '') })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Paid By</label>
                        <Select
                            value={newExpense.paidBy ? newExpense.paidBy.toString() : ""}  // Make sure value is consistent
                            onValueChange={(value) => {
                                console.log("PaidBy changed to:", value); // Debugging log
                                setNewExpense({ ...newExpense, paidBy: value });
                            }}
                        >
                            <SelectTrigger className="w-full">
                                {newExpense.paidBy
                                    ? newExpense.paidBy === user
                                        ? `You (${tripMembers.find(member => member.userID === user)?.username})`
                                        : tripMembers.find((member) => member.userID === newExpense.paidBy)?.username || "Select User"
                                    : "Select User"}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={user} value={user}>
                                    You ({tripMembers.find(member => member.userID === user)?.username})
                                </SelectItem>
                                {tripMembers
                                    .filter((member) => member.userID !== user)
                                    .map((member) => (
                                        <SelectItem key={member.userID} value={member.userID}>
                                            {member.username}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Split Method</label>
                        <Select
                            value={newExpense.splitMethod}
                            onValueChange={(value) =>
                                setNewExpense({ ...newExpense, splitMethod: value, splits: [] })
                            }
                        >
                            <SelectTrigger className="w-full">
                                {newExpense.splitMethod || "Select Split Method"}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="equal">Split Equally</SelectItem>
                                <SelectItem value="custom">Custom Split</SelectItem>
                                <SelectItem value="percentage">Split by Percentage</SelectItem>
                            </SelectContent>
                        </Select>

                        {newExpense.splitMethod !== "equal" && (
                            <div className="mt-4">
                                {/* Remaining Display */}
                                <p className="font-medium mb-2">
                                    Remaining:{" "}
                                    {newExpense.splitMethod === "custom"
                                        ? `RM ${(newExpense.amount - newExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0)).toFixed(2)}`
                                        : `Percentage: ${(100 - newExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0)).toFixed(2)}%`}
                                </p>

                                {/* Alert if remaining amount/percentage is not zero */}
                                {(newExpense.splitMethod === "custom" &&
                                    newExpense.amount - newExpense.splits.reduce((sum, split) => sum + (split.amount || 0), 0) !== 0) ||
                                    (newExpense.splitMethod === "percentage" &&
                                    100 - newExpense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0) !== 0) ? (
                                    <p className="text-red-600 text-sm">
                                        The full {newExpense.splitMethod === "custom" ? "amount" : "percentage"} must be allocated before saving.
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
                                                newExpense.splitMethod === "custom" ? "Amount (RM)" : "Percentage (%)"
                                            }
                                            value={
                                                newExpense.splitMethod === "custom"
                                                    ? newExpense.splits.find((split) => split.userID === member.userID)
                                                        ?.amount || ""
                                                    : newExpense.splits.find((split) => split.userID === member.userID)
                                                        ?.percentage || ""
                                            }
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value) || 0;

                                                const updatedSplits = newExpense.splits.filter(
                                                    (split) => split.userID !== member.userID
                                                );

                                                if (newExpense.splitMethod === "percentage") {
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
                                                        amount: (value / 100) * newExpense.amount,
                                                    });
                                                } else {
                                                    updatedSplits.push({
                                                        userID: member.userID,
                                                        amount: value,
                                                    });
                                                }

                                                setNewExpense({ ...newExpense, splits: updatedSplits });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
                <Button className="bg-[#4DB6AC] hover:bg-[#3B9B91] text-white w-full" onClick={handleAddExpense} disabled={isButtonLoading?.create}>
                    {isButtonLoading?.create ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                    Add Expense
                </Button>
            </DialogContent>
        </Dialog>
    )


}
export default AddExpense;
