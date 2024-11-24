import React from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import BudgetSection from "./BudgetSection.jsx";
import TabsSection from "./TabsSection.jsx";

// Import JSON data
import usersData from './db/users.json';
import expensesData from './db/expenses.json';
import friendsData from './db/friends.json';
// Local Storage Keys
const EXPENSES_KEY = 'splitwise_expenses';
const USERS_KEY = 'splitwise_users';
const FRIENDS_KEY = 'splitwise_friends';
const CURRENT_USER_KEY = 'splitwise_current_user';

export default function TeamBudgetPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Budget Section */}
            <BudgetSection />

            {/* Tabs Section */}
            <TabsSection />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}