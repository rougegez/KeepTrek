import React from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import BudgetSection from "./BudgetSection.jsx";
import TabsSection from "./TabsSection.jsx";
import { BudgetProvider } from "./BudgetContext";

export default function TeamBudgetPage() {
  return (
    <SidebarProvider>
      <BudgetProvider>
        <AppSidebar />
        <div className="flex h-screen w-screen">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              <BudgetSection />
              <TabsSection />
            </div>
          </div>
        </div>
      </BudgetProvider>
    </SidebarProvider>
  );
}