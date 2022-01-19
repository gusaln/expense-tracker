import { Knex } from "knex";
import { RecurrentTransactionDefinition } from "../types";
import updateRecurrentTransactionDefinition from "./updateRecurrentTransactionDefinition";

/**
 * Marks a recurrent transaction as finished if it is not already so.
 */
export default async function markRecurrentTransactionAsFinished(
  recurrentTransaction: RecurrentTransactionDefinition,
  connection?: Knex
) {
  if (recurrentTransaction.finished_at) return;

  await updateRecurrentTransactionDefinition(
    recurrentTransaction.id,
    {
      ...recurrentTransaction,
      finished_at: new Date(),
    },
    connection
  );
}
