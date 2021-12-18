import db, { isInvalidId } from "../../db";
import ResourceNotFoundError from "../../errors/resourceNotFoundError";
import { Transaction, TransactionDbId } from "../types";
import { transformDbRecordToTransaction } from "./transformDbRecordToTransaction";

/**
 * Finds an transactions by its id
 *
 * @throws {ResourceNotFoundError} if the transaction does not exist.
 */

export async function findTransactionById(id: TransactionDbId): Promise<Transaction> {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`Transaction ID ${id} not found.`);
  }

  const transactions = await db.table("transactions").where({ id }).limit(1);

  if (transactions.length === 0) {
    throw new ResourceNotFoundError(`Transaction ID ${id} not found.`);
  }

  return transformDbRecordToTransaction(transactions[0]);
}
