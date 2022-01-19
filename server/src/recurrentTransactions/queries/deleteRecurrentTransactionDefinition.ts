import db from "../../db";
import ApiError from "../../errors/apiError";
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
export default async function deleteRecurrentTransactionDefinition(id: RecurrentTransactionDefinitionDbId) {
  // Checks if recurrent transactions exists
  await findRecurrentTransactionDefinitionById(id);

  const transactionsInCount = await db
    .from<TransactionDbRecord>("transactions")
    .where("recurrence_id", id)
    .count("id");

  if (transactionsInCount[0].count > 0) {
    throw new ApiError(
      "There are transactions generated from this recurrence. As long as there are, the recurrent transactions can't be deleted."
    );
  }

  await db.from<RecurrentTransactionDefinitionDbRecord>("recurrent_transaction_definitions").where({ id }).del();
}
