import { Type } from "@sinclair/typebox";
import { ExpenseTransactionSchema } from "../../transactions/schemas";

const ExpenseSchema = Type.Omit(ExpenseTransactionSchema, ["type"], { $id: "Expense" });

export default ExpenseSchema;
