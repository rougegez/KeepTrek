import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle } from "lucide-react";
import ExpenseBreakdown from "./ExpeneseBreakdown.jsx";

export default function TabsSection() {
  const owedByPeople = [
    { name: "Anoop", amount: 280.1 },
    { name: "Angie", amount: 230.3 },
    { name: "Kyle", amount: 240.75 },
  ];

  const settledPeople = [{ name: "Bryan", amount: 220.47 }];

  return (
    <div className="flex-[4] overflow-y-auto border-l p-8 max-h-full">
      <Tabs defaultValue="settle-up" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="settle-up">Settle Up</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="settle-up">
          <Card className="p-6">
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#4DB6AC" strokeWidth="10" strokeDasharray="220 283" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-2xl font-bold">RM 971.47</div>
                  <div className="text-sm text-gray-500 text-center">
                    Your Total
                    <br />
                    Contribution
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-center text-sm mb-6">
              <div className="flex-1">
                <div className="font-semibold">Paid</div>
                <div className="text-[#4DB6AC]">RM 720.47</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold">Pending</div>
                <div className="text-[#98FB98]">RM 751.15</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                {owedByPeople.map((person, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Circle className="w-8 h-8 text-[#4DB6AC] fill-current" />
                      <span>{person.name} owes you</span>
                    </div>
                    <span className="font-semibold">RM {person.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">RM 751.15</span>
                </div>
              </div>

              <div>
                {settledPeople.map((person, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Circle className="w-8 h-8 text-[#98FB98] fill-current" />
                      <span>{person.name} has settled</span>
                    </div>
                    <span className="font-semibold">RM {person.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">RM 220.47</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <ExpenseBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  );
}