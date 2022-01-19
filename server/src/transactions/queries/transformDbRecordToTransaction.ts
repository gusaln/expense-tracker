import { TransactionDbRecord, TransactionOfType, TransactionType } from "../types";

export function transformDbRecordToTransaction<T extends TransactionType>(
  dbTransaction: TransactionDbRecord<T>
): TransactionOfType<T> {
  return {
    id: Number(dbTransaction.id),
    type: dbTransaction.type,
    recurrence_id: dbTransaction.recurrence_id,
    account_id: Number(dbTransaction.account_id),
    category_id: dbTransaction.category_id,
    description: dbTransaction.description,
    amount: Number(dbTransaction.amount),
    date: dbTransaction.date,
    transferred_to: dbTransaction.transferred_to,
    created_at: dbTransaction.created_at,
    updated_at: dbTransaction.updated_at,
  } as TransactionOfType<T>;
}
