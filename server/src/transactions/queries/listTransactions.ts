/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AccountDbId } from '../../accounts/types';
import { CategoryDbId } from '../../categories/types';
import db from '../../db';
import { Transaction, TransactionDbRecord, TransactionType } from '../types';
import { transformDbRecordToTransaction } from './transformDbRecordToTransaction';

export type ListTransactionsFilters = {
  type?: TransactionType,
  account_id?: AccountDbId,
  category_id?: CategoryDbId,
  before?: Date,
  after?: Date,
};
export type OrderByDirection = 'asc' | 'desc'
export type OrderBy = keyof Transaction | [keyof Transaction, OrderByDirection]

/**
 * Lists transactions.
 */
export async function listTransactions(filters: ListTransactionsFilters = {}, orderBy?: OrderBy) {
  const query = db.select().from<TransactionDbRecord>('transactions');

  if (filters.type) {
    query.where({ type: filters.type });
  }

  if (filters.account_id) {
    query.where({ account_id: filters.account_id });
  }

  if (filters.category_id) {
    query.where({ category_id: filters.category_id });
  }

  if (filters.before) {
    query.where('date', '<=', filters.before);
  }

  if (filters.after) {
    query.where('date', '>=', filters.after);
  }

  if (orderBy) {
    let direction: OrderByDirection = 'asc';
    [orderBy, direction] = Array.isArray(orderBy) ? orderBy : [orderBy, direction];

    query.orderBy(orderBy, direction);
  }

  const transactions = await query;

  return transactions.map(transformDbRecordToTransaction);
}
