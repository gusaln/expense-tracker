import { Knex } from "knex";
import db from "../../db";
import { parseDate } from "../../utils/date";
import {
  RecurrentTransactionDefinitionDbId,
  RecurrentTransactionDefinitionDbRecord,
  RecurrentTransactionDefinitionUpdate
} from "../types";
import findRecurrentTransactionDefinitionById from "./findRecurrentTransactionDefinitionById";
import transformDbRecordToRecurrentTransactionDefinition from "./transformDbRecordToRecurrentTransactionDefinition";

/**
 * Updates a recurrent transaction.
 *
 * @throws {ResourceNotFoundError} if the recurrent transaction does not exist.
 */
export default async function updateRecurrentTransactionDefinition(id: RecurrentTransactionDefinitionDbId,
  data: RecurrentTransactionDefinitionUpdate & { finished_at?: Date | null; },
  connection?: Knex) {
  // Checks if recurrent transaction exists
  await findRecurrentTransactionDefinitionById(id);

  const updatedRecurrentTransactions = await (connection || db)
    .from<RecurrentTransactionDefinitionDbRecord>("recurrent_transaction_definitions")
    .where({ id })
    .update({
      name: data.name,
      base_transaction_id: data.base_transaction_id,
      last_transaction_date: parseDate(data.last_transaction_date).toDate(),
      recur_freq: data.recur_freq,
      recur_interval: Number(data.recur_interval),
      recur_wkst: data.recur_wkst,
      recur_bymonth: data.recur_bymonth?.join(","),
      recur_byweekno: data.recur_byweekno?.join(","),
      recur_byyearday: data.recur_byyearday?.join(","),
      recur_bymonthday: data.recur_bymonthday?.join(","),
      recur_byday: data.recur_byday?.join(","),
      recur_byhour: data.recur_byhour?.join(","),
      recur_byminute: data.recur_byminute?.join(","),
      recur_bysecond: data.recur_bysecond?.join(","),
      recur_bysetpos: data.recur_bysetpos?.join(","),
      recur_until: data.recur_until,
      recur_count: data.recur_count,
      updated_at: new Date(),
    })
    .returning("*");

  return transformDbRecordToRecurrentTransactionDefinition(updatedRecurrentTransactions[0]);
}
