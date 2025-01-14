import React from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {ExpensesLeftside} from "./leftside/ExpensesLeftside.jsx";
import ExpenseRightSide from "./rightside/expenseRightside.jsx";
import { ExpensesProvider } from "./expenseContext.jsx";
import { useParams } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import { useMediaQuery } from 'react-responsive';

export default function MainExpensePage() {
  const { tripID } = useParams();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <SidebarProvider>
      <ExpensesProvider>
        <AppSidebar tripID={tripID} />
        {!isMobile && <SidebarTrigger />}
        {isMobile && <MobileHeader title="Expenses" />}
        <div className="flex h-screen w-screen">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              <ExpensesLeftside tripID={tripID}/>
              <ExpenseRightSide tripID={tripID}/>
            </div>
          </div>
        </div>
      </ExpensesProvider>
    </SidebarProvider>
  );
}