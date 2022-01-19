import { Knex } from "knex";
import db from "../../db";
import { TransactionDbRecord } from "../../transactions/types";
import { RecurrentTransactionDefinition } from "../types";

export default async function computeRecurrentTransactionLastDate(
  recurrentTransaction: RecurrentTransactionDefinition,
  connection?: Knex
): Promise<Date | null> {
  const records = await (connection || db)
    .table<TransactionDbRecord>("transactions")
    .where({ recurrence_id: recurrentTransaction.id })
    .orderBy("date", "desc")
    .select({ last_date: "date" })
    .limit(1);

  return records.length ? records[0].last_date : null;
}
