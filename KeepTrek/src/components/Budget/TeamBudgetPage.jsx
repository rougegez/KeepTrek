import React from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import BudgetSection from "./BudgetSection.jsx";
import TabsSection from "./TabsSection.jsx";

export default function TeamBudgetPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-full w-screen">
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