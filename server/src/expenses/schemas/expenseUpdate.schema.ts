import { Type } from "@sinclair/typebox";
import { RecurrentTransactionUpdateModeType } from "../../recurrentTransactions/schemas/recurrentTransactionDefinition.schema";
import ExpenseSchema from "./expense.schema";

export default Type.Omit(
  Type.Object({
    ...ExpenseSchema.properties,
    series_update_mode: Type.Optional(RecurrentTransactionUpdateModeType),
  }),
  ["id", "created_at", "updated_at"],
  { $id: "ExpenseUpdate" }
  );
