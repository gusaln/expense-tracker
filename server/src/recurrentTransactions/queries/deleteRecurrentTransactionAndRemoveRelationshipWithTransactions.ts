import db from "../../db";
import { TransactionDbRecord } from "../../transactions/types";
import {
  RecurrentTransactionDefinitionDbId,
  RecurrentTransactionDefinitionDbRecord
} from "../types";
import findRecurrentTransactionDefinitionById from "./findRecurrentTransactionDefinitionById";

/**
 * Deletes a recurrent transactions
 *
 * @throws {ResourceNotFoundError} if the recurrent transaction does not exist.
 */
export default async function deleteRecurrentTransactionDefinitionAndRemoveRelationshipWithTransactions(id: RecurrentTransactionDefinitionDbId) {
  // Checks if recurrent transactions exists
  await findRecurrentTransactionDefinitionById(id);

  await db.transaction(async (trx) => {
    await trx
      .from<TransactionDbRecord>("transactions")
      .where("recurrence_id", id)
      .update({ recurrence_id: undefined });

    await trx.from<RecurrentTransactionDefinitionDbRecord>("recurrent_transaction_definitions").where({ id }).del();
  });
}
