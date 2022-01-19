import db from "../../db";
import { transformDbRecordToTransaction } from "../../transactions/queries/transformDbRecordToTransaction";
import { Transaction, TransactionDbRecord } from "../../transactions/types";
import { RecurrentTransactionDefinition } from "../types";

/**
 * Find the transactions of a RecurrentTransaction
 */
export default async function findInstancesOfRecurrentTransaction(recurrentTransaction: RecurrentTransactionDefinition): Promise<Transaction[]> {
  return (
    await db
      .from<TransactionDbRecord>("transactions")
      .where({ recurrence_id: recurrentTransaction.id })
  ).map(transformDbRecordToTransaction);
}
