import db, { isInvalidId } from "../../db";
import ResourceNotFoundError from "../../errors/resourceNotFoundError";
import {
  RecurrentTransactionDefinition,
  RecurrentTransactionDefinitionDbId,
  RecurrentTransactionDefinitionDbRecord
} from "../types";
import transformDbRecordToRecurrentTransactionDefinition from "./transformDbRecordToRecurrentTransactionDefinition";

/**
 * Finds a recurrent transaction by its id
 *
 * @throws {ResourceNotFoundError} if the recur does not exist.
 */
export default async function findRecurrentTransactionDefinitionById(id: RecurrentTransactionDefinitionDbId): Promise<RecurrentTransactionDefinition> {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`RecurrentTransaction ID ${id} not found.`);
  }

  const recur = await db
    .from<RecurrentTransactionDefinitionDbRecord>("recurrent_transaction_definitions")
    .where({ id })
    .first();

  if (!recur) {
    throw new ResourceNotFoundError(`RecurrentTransaction ID ${id} not found.`);
  }

  return transformDbRecordToRecurrentTransactionDefinition(recur);
}
