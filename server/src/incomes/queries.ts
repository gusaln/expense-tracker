import db, { isInvalidId } from '../db';
import ResourceNotFoundError from '../errors/resourceNotFoundError';
import { TRANSACTION_TYPE_INCOME } from '../transactions/constants';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../transactions/queries';
import { IncomeTransaction, TransactionDbRecord, TransactionNew } from '../transactions/types';
import { Income, IncomeDbId, IncomeNew, IncomeUpdate } from './types';

type IncomeSelector = typeof TRANSACTION_TYPE_INCOME;

const transformDbRecordToIncome = (dbIncome: TransactionDbRecord<IncomeSelector>): Income => ({
  id: Number(dbIncome.id),
  account_id: Number(dbIncome.account_id),
  category_id: Number(dbIncome.category_id),
  description: dbIncome.description,
  amount: Number(dbIncome.amount),
  date: dbIncome.date,
  created_at: dbIncome.created_at,
  updated_at: dbIncome.updated_at,
});

const transformIncomeTransactionToIncome = (dbIncome: IncomeTransaction): Income => ({
  id: Number(dbIncome.id),
  account_id: Number(dbIncome.account_id),
  category_id: Number(dbIncome.category_id),
  description: dbIncome.description,
  amount: Number(dbIncome.amount),
  date: dbIncome.date,
  created_at: dbIncome.created_at,
  updated_at: dbIncome.updated_at,
});

/**
 * Lists all the incomes
 */
export const listIncomes = async (): Promise<Income[]> => {
  const incomes = (await listTransactions({ type: TRANSACTION_TYPE_INCOME }, ['date', 'desc']) as IncomeTransaction[]);

  return incomes.map(transformIncomeTransactionToIncome);
};

/**
 * Finds an incomes by its id
 *
 * @throws {ResourceNotFound} if the income does not exist.
 */
export const findIncomeById = async (id: IncomeDbId): Promise<Income> => {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`Income ID ${id} not found.`);
  }

  const income = await db.from<TransactionDbRecord<'income'>>('transactions')
    .where({ id, type: TRANSACTION_TYPE_INCOME })
    .first();

  if (!income) {
    throw new ResourceNotFoundError(`Income ID ${id} not found.`);
  }

  return transformDbRecordToIncome(income);
};

/**
 * Persistes an incomes to the database
 */
export const createIncome = async (data: IncomeNew): Promise<Income> => {
  const newIncome = await createTransaction({
    type: TRANSACTION_TYPE_INCOME,
    account_id: data.account_id,
    category_id: data.category_id,
    description: data.description,
    amount: data.amount,
    date: data.date,
  } as TransactionNew<'income'>);

  return transformIncomeTransactionToIncome(newIncome);
};

/**
 * Updates an income.
 *
 * @throws {ResourceNotFound} if the income does not exist.
 */
export const updateIncome = async (id: IncomeDbId, data: IncomeUpdate): Promise<Income> => {
  try {
    const updatedIncome = await updateTransaction(
      id,
      {
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        amount: data.amount,
        date: data.date,
      } as TransactionNew<'income'>
      );
    return transformIncomeTransactionToIncome(updatedIncome);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Income ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

/**
 * Deletes an income
 *
 * @throws {ResourceNotFound} if the income does not exist.
 */
export const deleteIncome = async (id: IncomeDbId): Promise<void> => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_INCOME);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Income ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};