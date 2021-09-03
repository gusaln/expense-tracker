const db = require('../../database/connection');
const RecordNotFound = require('../errors/RecordNotFound');
const { TRANSACTION_TYPE_EXPENSE } = require('../transactions/contants');
const {
  listTransactions, createTransaction, updateTransaction, deleteTransaction
} = require('../transactions/queries');

const transformDbRecordToExpense = (dbExpense) => ({
  id: Number(dbExpense.id),
  account_id: Number(dbExpense.account_id),
  category_id: Number(dbExpense.category_id),
  description: dbExpense.description,
  amount: Number(dbExpense.amount),
  date: dbExpense.date,
  created_at: dbExpense.created_at,
  updated_at: dbExpense.updated_at,
});

const isInvalidId = (id) => Number.isNaN(parseInt(id, 10));

/**
 * Lists all the expenses
 */
const listExpenses = async () => {
  const expenses = await listTransactions({ type: TRANSACTION_TYPE_EXPENSE }, ['date', 'desc']);

  return expenses.map(transformDbRecordToExpense);
};

/**
 * Finds an expenses by its id
 *
 * @param {string|number} id
 * @throws A RecordNotFound error if the expense does not exist.
 */
const findExpenseById = async (id) => {
  if (isInvalidId(id)) {
    throw new RecordNotFound(`Expense ID ${id} not found.`);
  }

  const expenses = await db.table('transactions').where({ id, type: TRANSACTION_TYPE_EXPENSE }).limit(1);

  if (expenses.length === 0) {
    throw new RecordNotFound(`Expense ID ${id} not found.`);
  }

  return transformDbRecordToExpense(expenses[0]);
};

/**
 * Persistes an expenses to the database
 *
 * @param {object} data
 */
const createExpense = async (data) => {
  const newExpense = await createTransaction({
    type: TRANSACTION_TYPE_EXPENSE,
    account_id: data.account_id,
    category_id: data.category_id,
    description: data.description,
    amount: data.amount,
    date: data.date,
  });

  return transformDbRecordToExpense(newExpense);
};

/**
 * Updates an expense.
 *
 * @param {number} id
 * @param {object} data
 * @throws A RecordNotFound error if the expense does not exist.
 */
const updateExpense = async (id, data) => {
  try {
    const updatedExpense = await updateTransaction(id, { ...data, type: TRANSACTION_TYPE_EXPENSE });
    return transformDbRecordToExpense(updatedExpense);
  } catch (error) {
    if (error instanceof RecordNotFound) {
      throw new RecordNotFound(`Expense ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

/**
 * Deletes an expense
 *
 * @param {number} id
 * @throws A RecordNotFound error if the expense does not exist.
 */
const deleteExpense = async (id) => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_EXPENSE);
  } catch (error) {
    if (error instanceof RecordNotFound) {
      throw new RecordNotFound(`Expense ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

module.exports = {
  listExpenses,
  findExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
