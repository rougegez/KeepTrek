import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2"; // Correct import for Pie chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { auth } from "../../firebaseConfig"; // Firebase config
import KeepTrek from "../../assets/KeepTrek.png"; // Replace with your asset
import "./BudgetPage.css"; // Import the CSS file
import { Login } from "../Authentication/Login";
import { Register } from "../Authentication/Register";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const BudgetPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseInput, setExpenseInput] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    youOwe: "",
  });
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowLoginModal(false);
        setShowRegisterModal(false);
      } else {
        setUser(null);
        setShowLoginModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setExpenseInput({
      ...expenseInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddExpense = () => {
    const { date, description, amount, category, youOwe } = expenseInput;

    if (!date || !description || !amount || !category || !youOwe) {
      alert("Please fill out all fields.");
      return;
    }

    const newExpense = {
      ...expenseInput,
      amount: parseFloat(expenseInput.amount),
      youOwe: parseFloat(expenseInput.youOwe),
    };
    setExpenses([...expenses, newExpense]);
    setExpenseInput({
      date: "",
      description: "",
      amount: "",
      category: "",
      youOwe: "",
    });
  };

  const totalCost = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const yourCost = expenses.reduce((acc, expense) => acc + expense.youOwe, 0);
  const youOwed = totalCost - yourCost;

  const categories = [
    "Stay",
    "Activities",
    "Food",
    "Transport",
    "Shopping",
    "Others",
  ];
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((category) =>
          expenses
            .filter((expense) => expense.category === category)
            .reduce((acc, expense) => acc + expense.amount, 0)
        ),
        backgroundColor: [
          "#4CAF50",
          "#FFCE56",
          "#FF6384",
          "#36A2EB",
          "#FD6B19",
          "#E0E4CC",
        ],
      },
    ],
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setUser(auth.currentUser);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <header id="grp-header" className="grp-navbar">
        <div className="grp-container">
          <div className="grp-navbar-left">
            <button onClick={() => navigate("/")} className="grp-logo-btn">
              <img src={KeepTrek} alt="KeepTrek Logo" className="grp-logo" />
            </button>
            <button
              onClick={() => navigate("/itinerary")}
              className="grp-nav-link"
            >
              Itinerary
            </button>
            <button
              onClick={() => navigate("/schedule")}
              className="grp-nav-link"
            >
              Group Scheduling
            </button>
          </div>
          <div className="grp-navbar-right">
            <button onClick={() => navigate("#")} className="grp-nav-link">
              How it Works
            </button>
            <button
              onClick={() => navigate("/schedule-summary")}
              className="grp-nav-link"
            >
              History
            </button>
            {user ? (
              <button
                className="grp-profile-btn"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            ) : (
              <button
                className="grp-profile-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="budget-page">
        {/* Budget Summary Section */}
        <div className="budget-summary">
          <h2>Total Trip Cost: RM {totalCost.toFixed(2)}</h2>
          <p>Your Cost: RM {yourCost.toFixed(2)}</p>
          <p>You Are Owed: RM {youOwed.toFixed(2)}</p>
        </div>

        {/* Expense Input Section */}
        <div className="expense-input">
          <h3>Add an Expense</h3>
          <input
            type="date"
            name="date"
            value={expenseInput.date}
            onChange={handleInputChange}
            placeholder="Date"
          />
          <input
            type="text"
            name="description"
            value={expenseInput.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="number"
            name="amount"
            value={expenseInput.amount}
            onChange={handleInputChange}
            placeholder="Amount"
          />
          <select
            name="category"
            value={expenseInput.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="Stay">Stay</option>
            <option value="Activities">Activities</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </select>
          <input
            type="number"
            name="youOwe"
            value={expenseInput.youOwe}
            onChange={handleInputChange}
            placeholder="You Owe"
          />
          <button onClick={handleAddExpense}>Add Expense</button>
        </div>

        {/* Expenses List Section */}
        <div className="expenses-section">
          <h3>Expenses</h3>
          <ul className="expenses-list">
            {expenses.map((expense, index) => (
              <li key={index}>
                <span>{expense.date}</span>
                <span>{expense.description}</span>
                <span>RM {expense.amount.toFixed(2)}</span>
                <span>You Owe: RM {expense.youOwe.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expense Breakdown Chart Section */}
        <div className="expense-breakdown">
          <h3>Expense Breakdown</h3>
          <Pie data={chartData} />
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <Login
          closeModal={handleCloseModal}
          switchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showRegisterModal && (
        <Register
          closeModal={handleCloseModal}
          switchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};
