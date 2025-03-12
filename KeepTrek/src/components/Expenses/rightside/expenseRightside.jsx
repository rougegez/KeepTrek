import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Breakdown} from './breakdown';
import SettleUp from './settleUp/settleUp';
import { useParams } from "react-router-dom";
import { ExpensesProvider } from '../expenseContext.jsx';

export default function ExpenseRightSide() {
    const { tripID } = useParams();
  return (
    <ExpensesProvider>
    <div className="flex-[4] overflow-y-auto border-l p-4 max-h-full">
      <Tabs defaultValue="settle-up" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="settle-up">Settle Up</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Settle-Up Tab */}
        <SettleUp tripID={tripID}/>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown">
          <Breakdown />
        </TabsContent>
      </Tabs>
    </div>
    </ExpensesProvider> 
  );
}