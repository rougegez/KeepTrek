import React from 'react'
import { Card } from "@/components/ui/card"
import { Legend, Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

// Import JSON data
import usersData from './db/users.json';
import expensesData from './db/expenses.json';
import friendsData from './db/friends.json';
// Local Storage Keys
const EXPENSES_KEY = 'splitwise_expenses';
const USERS_KEY = 'splitwise_users';
const FRIENDS_KEY = 'splitwise_friends';
const CURRENT_USER_KEY = 'splitwise_current_user';


const expenseData = [
  { name: 'Stay', value: 280.10, color: '#0EA5E9' },  // Sky blue
  { name: 'Activities', value: 230.30, color: '#FCD34D' },  // Yellow
  { name: 'Food', value: 240.75, color: '#F87171' },  // Red
  { name: 'Transport', value: 240.75, color: '#4ADE80' },  // Green
  { name: 'Shopping', value: 240.75, color: '#FB923C' },  // Orange
  { name: 'Others', value: 240.75, color: '#E879F9' },  // Pink
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-muted-foreground">
          RM {payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

const ExpenseBreakdown = () => {
  const total = expenseData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="p-4 max-h-500px">
      <div className="space-y-4">
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
                Expense
                <tspan x="50%" dy="20" className="fill-muted-foreground text-sm">
                  Breakdown
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

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
  )
}

export default ExpenseBreakdown