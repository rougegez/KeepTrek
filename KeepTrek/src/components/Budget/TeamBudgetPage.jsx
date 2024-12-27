import React from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import BudgetSection from "./BudgetSection.jsx";
import TabsSection from "./TabsSection.jsx";
import { BudgetProvider } from "./BudgetContext";
import { useParams } from "react-router-dom";

export default function TeamBudgetPage() {
  const { tripID } = useParams();
  return (
    <SidebarProvider>
      <BudgetProvider>
        <AppSidebar tripID={tripID}/>
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