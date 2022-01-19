import { Type } from "@sinclair/typebox";
import RecurrenceSchema from "../../recurrentTransactions/schemas/recurrence.schema";
import ExpenseSchema from "./expense.schema";

export default Type.Omit(
  Type.Object({
    ...ExpenseSchema.properties,
    recurrence: Type.Optional(RecurrenceSchema),
  }),
  ["id", "created_at", "updated_at"],
  { $id: "ExpenseNew" }
);
