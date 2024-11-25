import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useBudget } from "./BudgetContext";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-muted-foreground">
          RM {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseBreakdown = () => {
  const { expenses, currentUser } = useBudget();
  const [activeTab, setActiveTab] = useState("group"); // Tabs: 'group' or 'personal'

  // Type colors for consistency
  const typeColors = {
    Stay: "#0EA5E9", // Sky blue
    Activity: "#FCD34D", // Yellow
    Food: "#F87171", // Red
    Transport: "#4ADE80", // Green
    Shopping: "#FB923C", // Orange
    Others: "#E879F9", // Pink
  };

  // Group expense breakdown
  const groupExpenseData = useMemo(() => {
    const breakdown = expenses.reduce((acc, expense) => {
      const { type, amount } = expense;
      if (!acc[type]) {
        acc[type] = { name: type, value: 0, color: typeColors[type] || "#A0AEC0" };
      }
      acc[type].value += amount;
      return acc;
    }, {});
    return Object.values(breakdown);
  }, [expenses]);

  // Personal expense breakdown
  const personalExpenseData = useMemo(() => {
    if (!currentUser) return [];
    const breakdown = expenses.reduce((acc, expense) => {
      const userSplit = expense.splits.find(
        (split) => split.friendId === currentUser.id
      );
      if (userSplit) {
        const { type } = expense;
        if (!acc[type]) {
          acc[type] = { name: type, value: 0, color: typeColors[type] || "#A0AEC0" };
        }
        acc[type].value += userSplit.amount;
      }
      return acc;
    }, {});
    return Object.values(breakdown);
  }, [expenses, currentUser]);

  const totalGroup = groupExpenseData.reduce((sum, item) => sum + item.value, 0);
  const totalPersonal = personalExpenseData.reduce((sum, item) => sum + item.value, 0);

  const expenseData = activeTab === "group" ? groupExpenseData : personalExpenseData;
  const total = activeTab === "group" ? totalGroup : totalPersonal;

  return (
    <Card className="p-4 max-h-500px">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "group"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("group")}
          >
            Group Breakdown
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "personal"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Breakdown
          </button>
        </div>

        {/* Pie Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={150}
                paddingAngle={4}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="stroke-background hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground font-medium"
              >
                {activeTab === "group" ? "Group" : "Personal"} Expense
                <tspan
                  x="50%"
                  dy="20"
                  className="fill-muted-foreground text-sm"
                >
                  Breakdown
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Details */}
        <div className="space-y-4">
          {expenseData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="font-mono">RM {item.value.toFixed(2)}</span>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-mono font-semibold text-lg">
              RM {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseBreakdown;