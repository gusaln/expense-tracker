import { Type } from "@sinclair/typebox";
import { RecurrentTransactionUpdateModeType } from "../../recurrentTransactions/schemas/recurrentTransactionDefinition.schema";
import IncomeSchema from "./income.schema";

export default Type.Omit(
  Type.Object({
    ...IncomeSchema.properties,
    series_update_mode: Type.Optional(RecurrentTransactionUpdateModeType),
  }),
  ["id", "created_at", "updated_at"],
  { $id: "IncomeUpdate" }
  );
