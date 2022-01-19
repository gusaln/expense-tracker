import { Knex } from "knex";
import db, { isInvalidId } from "../db";
import ResourceNotFoundError from "../errors/resourceNotFoundError";
import { RecurrentTransactionDefinitionDbId } from "../recurrentTransactions/types";
import { TRANSACTION_TYPE_INCOME } from "../transactions/constants";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction
} from "../transactions/queries";
import {
  IncomeTransaction,
  TransactionDbRecord,
  TransactionNew,
  TransactionUpdate
} from "../transactions/types";
import { Income, IncomeDbId, IncomeNew, IncomeUpdate } from "./types";

type IncomeSelector = typeof TRANSACTION_TYPE_INCOME;

const transformDbRecordToIncome = (dbIncome: TransactionDbRecord<IncomeSelector>): Income => ({
  id: Number(dbIncome.id),
  recurrence_id: dbIncome.recurrence_id,
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
  recurrence_id: dbIncome.recurrence_id,
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
  const incomes = (await listTransactions({ type: TRANSACTION_TYPE_INCOME }, [
    "date",
    "desc",
  ])) as IncomeTransaction[];

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

  const income = await db
    .from<TransactionDbRecord<"income">>("transactions")
    .where({ id, type: TRANSACTION_TYPE_INCOME })
    .first();

  if (!income) {
    throw new ResourceNotFoundError(`Income ID ${id} not found.`);
  }

  return transformDbRecordToIncome(income);
};

/**
 * Persists an incomes to the database
 */
export const createIncome = async (data: IncomeNew, connection?: Knex): Promise<Income> => {
  const newIncome = await createTransaction(
    {
      type: TRANSACTION_TYPE_INCOME,
      account_id: data.account_id,
      category_id: data.category_id,
      description: data.description,
      amount: data.amount,
      date: data.date,
    } as TransactionNew<"income">,
    connection
  );

  return transformIncomeTransactionToIncome(newIncome);
};

/**
 * Updates an income.
 *
 * @throws {ResourceNotFound} if the income does not exist.
 */
export const updateIncome = async (
  id: IncomeDbId,
  data: IncomeUpdate,
  connection?: Knex
): Promise<Income> => {
  try {
    const updatedIncome = await updateTransaction(
      id,
      {
        id,
        type: "income",
        account_id: data.account_id,
        category_id: data.category_id,
        transferred_to: undefined,
        description: data.description,
        amount: data.amount,
        date: data.date,
      },
      connection
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
 * Updates many incomes in a series.
 */
export const updateManyIncomesInSeries = async (
  recurrenceId: RecurrentTransactionDefinitionDbId,
  data: Omit<IncomeUpdate, "date">,
  connection?: Knex
): Promise<void> => {
  (await listTransactions({ recurrence_id: recurrenceId, type: TRANSACTION_TYPE_INCOME })).forEach(
    async (incomeTr) => {
      await updateTransaction(
        incomeTr.id,
        {
          account_id: data.account_id,
          category_id: data.category_id,
          description: data.description,
          amount: data.amount,
        } as TransactionUpdate<"income">,
        connection
      );
    }
  );
};

/**
 * Updates many incomes in a series.
 */
export const updateManyIncomesInSeriesBefore = async (
  recurrenceId: RecurrentTransactionDefinitionDbId,
  before: Date,
  data: IncomeUpdate,
  connection?: Knex
): Promise<void> => {
  (
    await listTransactions({
      recurrence_id: recurrenceId,
      type: TRANSACTION_TYPE_INCOME,
      before: before,
    })
  ).forEach(async (incomeTr) => {
    await updateTransaction(
      incomeTr.id,
      {
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        amount: data.amount,
      } as TransactionUpdate<"income">,
      connection
    );
  });
};

/**
 * Deletes an income
 *
 * @throws {ResourceNotFound} if the income does not exist.
 */
export const deleteIncome = async (id: IncomeDbId, connection?: Knex): Promise<void> => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_INCOME, connection);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Income ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};
