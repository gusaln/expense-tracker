import db, { isInvalidId } from '../db';
import ResourceNotFoundError from '../errors/resourceNotFoundError';
import { TRANSACTION_TYPE_EXPENSE } from '../transactions/constants';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../transactions/queries';
import { ExpenseTransaction, TransactionDbRecord, TransactionNew } from '../transactions/types';
import { Expense, ExpenseDbId, ExpenseNew, ExpenseUpdate } from './types';

type ExpenseSelector = typeof TRANSACTION_TYPE_EXPENSE;

const transformDbRecordToExpense = (dbExpense: TransactionDbRecord<ExpenseSelector>): Expense => ({
  id: Number(dbExpense.id),
  account_id: Number(dbExpense.account_id),
  category_id: Number(dbExpense.category_id),
  description: dbExpense.description,
  amount: Number(dbExpense.amount),
  date: dbExpense.date,
  created_at: dbExpense.created_at,
  updated_at: dbExpense.updated_at,
});

const transformExpenseTransactionToExpense = (dbExpense: ExpenseTransaction): Expense => ({
  id: Number(dbExpense.id),
  account_id: Number(dbExpense.account_id),
  category_id: Number(dbExpense.category_id),
  description: dbExpense.description,
  amount: Number(dbExpense.amount),
  date: dbExpense.date,
  created_at: dbExpense.created_at,
  updated_at: dbExpense.updated_at,
});

/**
 * Lists all the expenses
 */
export const listExpenses = async (): Promise<Expense[]> => {
  const expenses = (await listTransactions({ type: TRANSACTION_TYPE_EXPENSE }, ['date', 'desc']) as ExpenseTransaction[]);

  return expenses.map(transformExpenseTransactionToExpense);
};

/**
 * Finds an expenses by its id
 *
 * @throws {ResourceNotFound} if the expense does not exist.
 */
export const findExpenseById = async (id: ExpenseDbId): Promise<Expense> => {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`Expense ID ${id} not found.`);
  }

  const expense = await db.from<TransactionDbRecord<'expense'>>('transactions')
    .where({ id, type: TRANSACTION_TYPE_EXPENSE })
    .first();

  if (!expense) {
    throw new ResourceNotFoundError(`Expense ID ${id} not found.`);
  }

  return transformDbRecordToExpense(expense);
};

/**
 * Persistes an expenses to the database
 */
export const createExpense = async (data: ExpenseNew): Promise<Expense> => {
  const newExpense = await createTransaction({
    type: TRANSACTION_TYPE_EXPENSE,
    account_id: data.account_id,
    category_id: data.category_id,
    description: data.description,
    amount: data.amount,
    date: data.date,
  } as TransactionNew<'expense'>);

  return transformExpenseTransactionToExpense(newExpense);
};

/**
 * Updates an expense.
 *
 * @throws {ResourceNotFound} if the expense does not exist.
 */
export const updateExpense = async (id: ExpenseDbId, data: ExpenseUpdate): Promise<Expense> => {
  try {
    const updatedExpense = await updateTransaction(
      id,
      {
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        amount: data.amount,
        date: data.date,
      } as TransactionNew<'expense'>
      );
    return transformExpenseTransactionToExpense(updatedExpense);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Expense ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

/**
 * Deletes an expense
 *
 * @throws {ResourceNotFound} if the expense does not exist.
 */
export const deleteExpense = async (id: ExpenseDbId): Promise<void> => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_EXPENSE);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Expense ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};