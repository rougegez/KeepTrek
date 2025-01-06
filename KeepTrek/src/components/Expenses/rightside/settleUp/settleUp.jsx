// SettleUp.jsx
import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import DebtsSummary from "./debtsSumary";
// import SettleDebtDialog from "./SettleDebtDialog";
// import SetBudgetDialog from "./SettleBudgetDialog";
import { useExpenses } from "@/components/Expenses/expenseContext";
import { balanceMap } from "@/APIs/expenses";
import { useParams } from "react-router-dom";


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
        {/* <BudgetProgress
          currentUserBudget={currentUserBudget}
          
          progressPercentage={progressPercentage}
          onSetBudget={() => setIsBudgetModalOpen(true)}
          calculateYourExpense={calculateYourExpense}
        /> */}

        <DebtsSummary
          tripID={tripID}
        />
      </Card>

      {/* Settle-Up Dialog */}
      {/* <SettleDebtDialog
        selectedDebt={selectedDebt}
        findUserById={findUserById}
        paymentAmount={paymentAmount}
        onClose={() => setSelectedDebt(null)}
        onPaymentChange={(e) => setPaymentAmount(e.target.value)}
        onPayment={handlePayment}
      /> */}

      {/* Set Budget Dialog */}
      {/* <SetBudgetDialog
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        userBudget={userBudget}
        onBudgetChange={(e) => setUserBudget(e.target.value)}
        onSaveBudget={handleEditBudget}
      /> */}
    </TabsContent>
  );
}