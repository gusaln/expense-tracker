import db, { isInvalidId } from "../../db";
import ResourceNotFoundError from "../../errors/resourceNotFoundError";
import { TransactionDbId, TransactionDbRecord } from "../types";
import { transformDbRecordToTransaction } from "./transformDbRecordToTransaction";

/**
 * Finds many transactions by their ids
 *
 * @throws {ResourceNotFoundError} if one of the transactions does not exist.
 */
export async function findManyTransactionsById(ids: TransactionDbId | TransactionDbId[]) {
  ids = Array.from(new Set(Array.isArray(ids) ? ids : [ids]));

  ids.forEach((id) => {
    if (isInvalidId(id)) {
      throw new ResourceNotFoundError(`Transaction ID ${id} not found.`);
    }
  });
  const transactions = await db.from<TransactionDbRecord>("transactions").whereIn("id", ids);

  if (transactions.length !== ids.length) {
    throw new ResourceNotFoundError(`Transaction IDs ${ids.join(",")} not found.`);
  }

  return transactions.map(transformDbRecordToTransaction);
}
