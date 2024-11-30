import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettleUp from "./SettleUp/SettleUp";
import ExpenseBreakdown from "./ExpeneseBreakdown";

export default function TabsSection() {
  return (
    <div className="flex-[4] overflow-y-auto border-l p-8 max-h-full">
      <Tabs defaultValue="settle-up" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="settle-up">Settle Up</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Settle-Up Tab */}
        <SettleUp />

        {/* Breakdown Tab */}
        <TabsContent value="breakdown">
          <ExpenseBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  );
}