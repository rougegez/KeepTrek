import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Droplet, Bike, Home, Waves, Wine } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function BudgetSection() {
  const [expenses, setExpenses] = useState([
    { date: "June 21", type: "Food", icon: <Utensils className="w-6 h-6" />, description: "Restaurant Zat Teng", amount: 83.9, paidBy: "Alex Goh", youOwe: 17.0 },
    { date: "June 21", type: "Travel", icon: <Droplet className="w-6 h-6" />, description: "Petrol", amount: 60.0, paidBy: "Anoop Singh", youOwe: 12.0 },
    { date: "June 21", type: "Activity", icon: <Bike className="w-6 h-6" />, description: "ATV ride", amount: 400.0, paidBy: "Mike Lee", youOwe: 80.0 },
  ]);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0], // Set today's date
    type: "Food",
    description: "",
    amount: "",
    paidBy: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [isClosing, setIsClosing] = useState(false); // Add state to track animation

  const handleAddExpense = () => {
    // Generate an icon based on the type
    const typeIcons = {
      Food: <Utensils className="w-6 h-6" />,
      Activity: <Bike className="w-6 h-6" />,
      Stay: <Home className="w-6 h-6" />,
      Travel: <Waves className="w-6 h-6" />,
      Drinks: <Wine className="w-6 h-6" />,
    };
  
    // Generate random 2-digit value for `youOwe` or `youPaid`
    const randomValue = Math.floor(Math.random() * 90) + 10;
  
    const newExpense = {
      ...form,
      icon: typeIcons[form.type],
      amount: parseFloat(form.amount),
      youOwe: form.paidBy === "You" ? undefined : randomValue,
      youPaid: form.paidBy === "You" ? randomValue : undefined,
    };
  
    setIsClosing(true); // Trigger the animation
  
    setTimeout(() => {
      // Add the new expense after the animation ends
      setExpenses((prev) => [...prev, newExpense]);
      setIsClosing(false); // Reset closing state
      setForm({
        date: new Date().toISOString().split("T")[0],
        type: "Food",
        description: "",
        amount: "",
        paidBy: "",
      });
    }, 300); // Animation duration
  };

  return (
    <div className="flex-[6] overflow-y-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Budget</h2>
      <Card className="mb-8">
        <div className="flex p-6 gap-6">
          <div className="bg-[#4DB6AC] text-white p-6 rounded-xl w-52 h-44 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold block mb-1">RM 1346</span>
              <span className="text-2xl font-bold block mb-1">Total Trip Expense</span>
            </div>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="bg-[#E0F7FA] p-3 rounded-xl w-full h-20">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold block mb-1">Your Expense</span>
                <span className="text-2xl font-bold block mb-1">RM 273</span>
              </div>
            </div>
            <div className="bg-[#E8F5E9] p-3 rounded-xl w-full h-20">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold block mb-1">You are owed:</span>
                <span className="text-2xl font-bold block mb-1">RM 751</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Expenses</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#4DB6AC] hover:bg-[#3B9B91] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Expense
              </Button>
            </DialogTrigger>
            <motion.div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} initial={{ scale: 1 }} animate={{ scale: isClosing ? 0 : 1 }} transition={{ duration: 0.3 }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input type="date" name="date" value={form.date} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select value={form.type} onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger className="w-full">{form.type}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Activity">Activity</SelectItem>
                      <SelectItem value="Stay">Stay</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Drinks">Drinks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input type="text" name="description" value={form.description} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (RM)</label>
                  <Input type="text" name="amount" value={form.amount} onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numeric values
                    if (!isNaN(value) && /^\d*\.?\d*$/.test(value)) {
                      setForm((prev) => ({ ...prev, amount: value }));
                    }
                  }}/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Paid By</label>
                  <Select value={form.paidBy} onValueChange={(value) => setForm((prev) => ({ ...prev, paidBy: value }))}>
                    <SelectTrigger className="w-full">{form.paidBy || "Select User"}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="You">You</SelectItem>
                      <SelectItem value="Alex Goh">Alex Goh</SelectItem>
                      <SelectItem value="Anoop Singh">Anoop Singh</SelectItem>
                      <SelectItem value="Mike Lee">Mike Lee</SelectItem>
                      <SelectItem value="Aziza Aziz">Aziza Aziz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <Button
                className="mt-4 bg-[#4DB6AC] hover:bg-[#3B9B91] text-white w-full"
                onClick={handleAddExpense}>
                Add Expense
              </Button>
            </DialogContent>
            </motion.div>
          </Dialog>
        </div>

        <div className="space-y-3">
          {expenses.map((expense, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-full">{expense.icon}</div>
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-500">
                      {expense.date} • Paid by {expense.paidBy}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">RM {expense.amount.toFixed(2)}</div>
                  {expense.youOwe && <div className="text-sm text-red-500">You owe: RM {expense.youOwe.toFixed(2)}</div>}
                  {expense.youPaid && <div className="text-sm text-green-500">You paid: RM {expense.youPaid.toFixed(2)}</div>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}