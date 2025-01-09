// SettleUp.jsx
import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import DebtsSummary from "./debtsSumary";
// import SettleDebtDialog from "./SettleDebtDialog";
// import SetBudgetDialog from "./SettleBudgetDialog";
import { useExpenses } from "@/components/Expenses/expenseContext";
import { useParams } from "react-router-dom";
import {BudgetProgress} from './budgetProgress';


export default function SettleUp() {
  const { tripID } = useParams();

    
  const {
    expenses,
    user,
    totalUser,
    tripMembers,
  } = useExpenses();

  return (
    <TabsContent value="settle-up">
      <Card className="p-6">
        <BudgetProgress
          tripID={tripID}/>

        

        <DebtsSummary
          tripID={tripID}
        />
      </Card>
    </TabsContent>
  );
}