import React, { useState } from "react";
import KeepTrek from "../../assets/KeepTrek.png";
import "./TeamBudgetPage.css";

import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";

export const TeamBudgetPage = () => {
  const [user] = useState({
    uid: "123",
    displayName: "John Doe",
    email: "john@example.com",
  });
  const [teamName] = useState("Team Alpha");
  const [teamMembers] = useState([
    { id: "1", displayName: "Alice" },
    { id: "2", displayName: "Bob" },
    { id: "3", displayName: "Charlie" },
  ]);
  const [expenses] = useState([
    {
      date: "2023-11-01",
      description: "Hotel",
      amount: 500,
      category: "Stay",
      youOwe: 200,
    },
    {
      date: "2023-11-02",
      description: "Dinner",
      amount: 150,
      category: "Food",
      youOwe: 50,
    },
    {
      date: "2023-11-03",
      description: "Taxi",
      amount: 100,
      category: "Transport",
      youOwe: 40,
    },
  ]);
  const [teamLink] = useState("https://example.com/join-team/dummyTeamId");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeChart, setActiveChart] = useState("breakdown");

  const totalCost = 1346;
  const yourCost = 273;
  const youOwed = 751;

  const categories = [
    "Stay",
    "Activities",
    "Food",
    "Transport",
    "Shopping",
    "Others",
  ];
  const categoryColors = [
    "#a569bd",
    "#27ae60",
    "#5dade2",
    "#82e0aa",
    "#b2babb",
    "#e74c3c",
  ];
  const chartDataBreakdown = categories.map((category, index) => {
    return {
      name: category,
      value: Math.random() * 200, // Random value for demo purposes
      fill: categoryColors[index],
    };
  });

  const chartDataSettleUp = [
    { name: "Paid Amount", value: totalCost, fill: "#36A2EB" },
    { name: "Pending Amount", value: youOwed, fill: "#FF6384" },
  ];

  const chartData =
    activeChart === "settleUp" ? chartDataSettleUp : chartDataBreakdown;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="team-budget-page">
        <div className="budget-container">
          <div className="left-section">
            <div className="budget-summary">
              <div className="summary-card new-summary-layout">
                <div className="summary-item total-cost">
                  <h3>RM {totalCost.toFixed(2)}</h3>
                  <p>Total Trip Cost</p>
                </div>
                <div className="summary-item your-cost">
                  <p>Your Cost</p>
                  <h3>RM {yourCost.toFixed(2)}</h3>
                </div>
                <div className="summary-item owed">
                  <p>You are owed:</p>
                  <h3>RM {youOwed.toFixed(2)}</h3>
                </div>
              </div>
            </div>

            <div className="budget-expenses-section">
              <div className="expenses-header">
                <h3>Expenses</h3>
                <button
                  className="add-expense-btn"
                  onClick={() => setShowExpenseModal(true)}
                >
                  + Expense
                </button>
              </div>
              <ul className="budget-expenses-list">
                {expenses.map((expense, index) => (
                  <li key={index} className="expense-item">
                    <div className="expense-date">
                      <span>{expense.date}</span>
                    </div>
                    <div className="expense-description">
                      <p>{expense.description}</p>
                      <span>Paid by: {user?.displayName || user?.email}</span>
                    </div>
                    <div className="expense-amount">
                      <h4>RM {expense.amount.toFixed(2)}</h4>
                      <span
                        className={`owe-info ${
                          expense.youOwe > 0 ? "you-owe" : "you-lent"
                        }`}
                      >
                        {expense.youOwe > 0
                          ? `You Owe: RM ${expense.youOwe.toFixed(2)}`
                          : `You lent: RM ${(
                              expense.amount - expense.youOwe
                            ).toFixed(2)}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="right-section">
            <div className="budget-expense-breakdown">
              <div className="chart-nav">
                <button
                  className={`chart-nav-btn ${
                    activeChart === "settleUp" ? "active" : ""
                  }`}
                  onClick={() => setActiveChart("settleUp")}
                >
                  Settle Up
                </button>
                <button
                  className={`chart-nav-btn ${
                    activeChart === "breakdown" ? "active" : ""
                  }`}
                  onClick={() => setActiveChart("breakdown")}
                >
                  Breakdown
                </button>
              </div>
              <div
                className="budget-pie-chart"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PieChart width={300} height={300} className="chart-center">
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    labelLine={false}
                  >
                    <Label
                      value={
                        activeChart === "breakdown"
                          ? "Expense Breakdown"
                          : `RM ${totalCost.toFixed(2)}`
                      }
                      position="center"
                      className="chart-center-label"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        textAlign: "center",
                        fill: "#333",
                      }}
                    />
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `RM ${value.toFixed(2)}`} />
                </PieChart>
                <div
                  className="chart-legend"
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  {chartData.map((entry, index) => (
                    <div key={index} className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: entry.fill }}
                      ></span>
                      <span>
                        {entry.name}: RM {entry.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="settle-summary-box">
              {teamMembers.map((member) => (
                <div className="settle-item" key={member.id}>
                  <span>{member.displayName || member.email} </span>{" "}
                  <span>
                    owes you: RM {(youOwed / teamMembers.length).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="settled-item">
                <span>{user?.displayName || user?.email} has settled </span>
                <span>Total: RM {yourCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {showExpenseModal && (
          <div className="expense-modal">
            <div className="expense-modal-content">
              <h3>Add an Expense</h3>
              <input
                type="date"
                name="date"
                value="2023-11-10"
                placeholder="Date"
              />
              <input
                type="text"
                name="description"
                value="Random Expense"
                placeholder="Description"
              />
              <input
                type="number"
                name="amount"
                value="123"
                placeholder="Amount"
              />
              <select name="category" value="Food">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="youOwe"
                value="50"
                placeholder="You Owe"
              />
              <select name="teamMember" value={teamMembers[0].id}>
                <option value="">Who Do You Owe</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.displayName || member.email}
                  </option>
                ))}
              </select>
              <button
                className="budget-btn-primary"
                onClick={() => setShowExpenseModal(false)}
              >
                Add Expense
              </button>
              <button
                className="budget-btn-secondary"
                onClick={() => setShowExpenseModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
};
