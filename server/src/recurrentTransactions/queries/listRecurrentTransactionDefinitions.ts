import db from "../../db";
import { RecurrentTransactionDefinitionDbRecord } from "../types";
import transformDbRecordToRecurrentTransactionDefinition from "./transformDbRecordToRecurrentTransactionDefinition";

type ListRecurrentTransactionsFiltersFilters = {
  finished?: boolean;
};

/**
 * Lists all the recurrent transactions
 */
export default async function listRecurrentTransactionDefinitions(
  filters: ListRecurrentTransactionsFiltersFilters = {}
) {
  const query = db.select().from<RecurrentTransactionDefinitionDbRecord>("recurrent_transaction_definitions");

  if (typeof filters.finished == "boolean") {
    if (filters.finished) query.whereNotNull("finished_at");
    else query.whereNull("finished_at");
  }

  return (await query).map(transformDbRecordToRecurrentTransactionDefinition);
}
