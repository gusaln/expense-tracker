import { Type } from "@sinclair/typebox";
import recurrentTransactionSchema from "./recurrentTransactionDefinition.schema";

/**
 * The schema for the recurrence attribute of the transactions.
 */
export default Type.Omit(
  Type.Object({
    ...recurrentTransactionSchema.properties,
    name: Type.Optional(recurrentTransactionSchema.properties.name),
  }),
  [
    "id",
    "base_transaction_id",
    "last_transaction_date",
    "created_at",
    "updated_at",
    "finished_at",
  ],
  { $id: "Recurrence" }
);
