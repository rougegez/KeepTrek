import React, { useState } from "react";
import AppSidebar from "../Sidebar/Sidebar.jsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {ExpensesLeftside} from "./leftside/ExpensesLeftside.jsx";
import ExpenseRightSide from "./rightside/expenseRightside.jsx";
import { ExpensesProvider } from "./expenseContext.jsx";
import { useParams } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import { useMediaQuery } from 'react-responsive';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { canEdit } from "@/utils/permissions";
import { useQuery } from 'react-query';
import { getTrip } from "@/APIs/trip";
import { CurrentUser } from '@/APIs/auth';

export default function MainExpensePage() {
  const { tripID } = useParams();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [isRightSideOpen, setIsRightSideOpen] = useState(false);
  const { data: tripDetails } = useQuery(['trip', tripID], () => getTrip(tripID));
  const currentUser = CurrentUser();
  const userRole = tripDetails?.users.find(u => u.userID === currentUser)?.role;
  const canModify = canEdit(userRole);

  return (
    <SidebarProvider>
      <ExpensesProvider value={{ canModify }}>
        <AppSidebar tripID={tripID} />
        {!isMobile && <SidebarTrigger />}
        {isMobile && <MobileHeader title="Expenses" />}
        <div className="flex h-screen w-screen">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              <ExpensesLeftside tripID={tripID}/>
              {isMobile ? (
                <Sheet open={isRightSideOpen} onOpenChange={setIsRightSideOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      className="fixed bottom-4 right-4 z-50"
                      variant="outline"
                    >
                      Show Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[90%] sm:w-[85%]">
                    <ExpenseRightSide tripID={tripID}/>
                  </SheetContent>
                </Sheet>
              ) : (
                <ExpenseRightSide tripID={tripID}/>
              )}
            </div>
          </div>
        </div>
      </ExpensesProvider>
    </SidebarProvider>
  );
}