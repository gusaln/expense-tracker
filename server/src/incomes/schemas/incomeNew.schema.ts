import { Type } from "@sinclair/typebox";
import RecurrenceSchema from "../../recurrentTransactions/schemas/recurrence.schema";
import IncomeSchema from "./income.schema";

export default Type.Omit(
  Type.Object({
    ...IncomeSchema.properties,
    recurrence: Type.Optional(RecurrenceSchema),
  }),
  ["id", "created_at", "updated_at"],
  { $id: "IncomeNew" }
);
