// src/components/Budget/TeamBudgetPage.jsx
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
// import { firestore, auth } from "../../firebaseConfig";
// import {
//   collection,
//   addDoc,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   updateDoc,
//   arrayUnion,
// } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import KeepTrek from "../../assets/KeepTrek.png";
import "./TeamBudgetPage.css";

export const TeamBudgetPage = () => {
  const [user, setUser] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseInput, setExpenseInput] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
    youOwe: "",
  });
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [teamLink, setTeamLink] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const navigate = useNavigate();
  const { teamId } = useParams();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchTeamData(teamId);
        await fetchExpenses(currentUser.uid);
      } else {
        setUser(null);
        navigate("/expense-splitting");
      }
    });

    return () => unsubscribe();
  }, [teamId]);

  const fetchTeamData = async (teamId) => {
    try {
      const teamRef = doc(firestore, "teams", teamId);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        setTeamName(teamData.name || "");

        const memberIds = teamData.members;
        // Fetch user data for each member
        const members = [];
        for (const memberId of memberIds) {
          const memberRef = doc(firestore, "users", memberId);
          const memberDoc = await getDoc(memberRef);
          if (memberDoc.exists()) {
            members.push({ id: memberId, ...memberDoc.data() });
          }
        }

        setTeamMembers(members);
      } else {
        alert("Team does not exist.");
        navigate("/expense-splitting");
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      alert("Failed to load team data.");
      navigate("/expense-splitting");
    }
  };

  const fetchExpenses = async (userId) => {
    try {
      const expensesRef = collection(firestore, "users", userId, "expenses");
      const expensesSnapshot = await getDocs(expensesRef);
      const expensesData = expensesSnapshot.docs.map((doc) => doc.data());
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const generateTeamLink = () => {
    const link = `${window.location.origin}/join-team/${teamId}`;
    setTeamLink(link);
    navigator.clipboard.writeText(link);
    alert("Team invite link copied to clipboard!");
  };

  const handleExpenseSubmit = async () => {
    const { date, description, amount, category, youOwe } = expenseInput;

    if (
      !date ||
      !description ||
      !amount ||
      !category ||
      !youOwe ||
      !selectedTeamMember
    ) {
      alert("Please fill out all fields including team member.");
      return;
    }

    const newExpense = {
      ...expenseInput,
      amount: parseFloat(expenseInput.amount),
      youOwe: parseFloat(expenseInput.youOwe),
      userId: user.uid,
      teamMember: selectedTeamMember,
      timestamp: new Date(),
    };

    try {
      await addDoc(
        collection(firestore, "users", user.uid, "expenses"),
        newExpense
      );
      setExpenses([...expenses, newExpense]);
      setExpenseInput({
        date: "",
        description: "",
        amount: "",
        category: "",
        youOwe: "",
      });
      setSelectedTeamMember("");
      alert("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense: ", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setExpenseInput({ ...expenseInput, [e.target.name]: e.target.value });
  };

  const handleAddExpense = () => {
    handleExpenseSubmit();
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

  // Prepare the chart data
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
                onClick={() => navigate("/expense-splitting")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="team-budget-page">
        <div className="team-header">
          <h2>Team: {teamName}</h2>
          <button className="budget-btn-secondary" onClick={generateTeamLink}>
            Generate Team Invite Link
          </button>
          <button
            className="budget-btn-secondary"
            onClick={() => setShowTeamDropdown(!showTeamDropdown)}
          >
            {showTeamDropdown ? "Hide Team Members" : "Show Team Members"}
          </button>
          {showTeamDropdown && (
            <div className="team-members-dropdown">
              <h4>Team Members:</h4>
              {teamMembers.length > 0 ? (
                <ul>
                  {teamMembers.map((member, index) => (
                    <li key={index}>
                      {member.displayName || member.email} ({member.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No team members yet</p>
              )}
            </div>
          )}
        </div>

        <div className="budget-summary">
          <h2>Total Trip Cost: RM {totalCost.toFixed(2)}</h2>
          <p>Your Cost: RM {yourCost.toFixed(2)}</p>
          <p>You Are Owed: RM {youOwed.toFixed(2)}</p>
        </div>

        <div className="budget-expense-input">
          <h3>Add an Expense</h3>
          <input
            type="date"
            name="date"
            value={expenseInput.date}
            onChange={handleInputChange}
            placeholder="mm/dd/yyyy"
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="youOwe"
            value={expenseInput.youOwe}
            onChange={handleInputChange}
            placeholder="You Owe"
          />
          <select
            name="teamMember"
            value={selectedTeamMember}
            onChange={(e) => setSelectedTeamMember(e.target.value)}
          >
            <option value="">Select Team Member</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.displayName || member.email}
              </option>
            ))}
          </select>
          <button className="budget-btn-primary" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>

        <div className="budget-expenses-section">
          <h3>Expenses</h3>
          <ul className="budget-expenses-list">
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

        <div className="budget-expense-breakdown">
          <h3>Expense Breakdown</h3>
          <div className="budget-pie-chart">
            {/* Render the Pie chart */}
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </>
  );
};
