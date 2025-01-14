import {ExpensesTotals} from './expenseTotals.jsx';
import { useParams } from "react-router-dom";
import { ExpensesProvider } from '../expenseContext.jsx';
import { ExpenseList } from './expenseList/expenseList.jsx';
import { Card } from "@/components/ui/card";
import {AddExpense} from './expenseList/addExpense.jsx';

export const ExpensesLeftside = () => {
    const { tripID } = useParams();
    return(
        <ExpensesProvider>
        <div className="flex-[6] overflow-y-auto p-6 max-h-full">
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Expenses</h1>
        </div>
        <Card className="mb-8">
            <ExpensesTotals tripID={tripID} />
        </Card>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Expenses</h3>
            <AddExpense tripID={tripID} />
            </div>
            <ExpenseList tripID={tripID} />

            </div>
        </div>


        
        </ExpensesProvider>


    );
}
export default ExpensesLeftside;
