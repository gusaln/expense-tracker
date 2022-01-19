import { RecurrentTransactionDefinition, RecurrentTransactionDefinitionDbRecord } from "../types";

export default function transformDbRecordToRecurrentTransactionDefinition(dbRecord: RecurrentTransactionDefinitionDbRecord): RecurrentTransactionDefinition {
  return ({
    id: Number(dbRecord.id),
    name: dbRecord.name,
    base_transaction_id: dbRecord.base_transaction_id,
    last_transaction_date: dbRecord.last_transaction_date,
    recur_freq: dbRecord.recur_freq,
    recur_interval: dbRecord.recur_interval,
    recur_wkst: dbRecord.recur_wkst,
    recur_bymonth: dbRecord.recur_bymonth?.split(","),
    recur_byweekno: dbRecord.recur_byweekno?.split(","),
    recur_byyearday: dbRecord.recur_byyearday?.split(","),
    recur_bymonthday: dbRecord.recur_bymonthday?.split(","),
    recur_byday: dbRecord.recur_byday?.split(","),
    recur_byhour: dbRecord.recur_byhour?.split(","),
    recur_byminute: dbRecord.recur_byminute?.split(","),
    recur_bysecond: dbRecord.recur_bysecond?.split(","),
    recur_bysetpos: dbRecord.recur_bysetpos?.split(","),
    recur_until: dbRecord.recur_until,
    recur_count: dbRecord.recur_count ? Number(dbRecord.recur_count) : undefined,
    created_at: dbRecord.created_at,
    updated_at: dbRecord.updated_at,
    finished_at: dbRecord.finished_at,
  });
}
