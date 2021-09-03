const db = require('../../database/connection');
const RecordNotFound = require('../errors/RecordNotFound');
const { TRANSACTION_TYPE_INCOME } = require('../transactions/contants');
const {
  listTransactions, createTransaction, updateTransaction, deleteTransaction
} = require('../transactions/queries');

const transformDbRecordToIncome = (dbIncome) => ({
  id: Number(dbIncome.id),
  account_id: Number(dbIncome.account_id),
  category_id: Number(dbIncome.category_id),
  description: dbIncome.description,
  amount: Number(dbIncome.amount),
  date: dbIncome.date,
  created_at: dbIncome.created_at,
  updated_at: dbIncome.updated_at,
});

const isInvalidId = (id) => Number.isNaN(parseInt(id, 10));

/**
 * Lists all the incomes
 */
const listIncomes = async () => {
  const incomes = await listTransactions({ type: TRANSACTION_TYPE_INCOME }, ['date', 'desc']);

  return incomes.map(transformDbRecordToIncome);
};

/**
 * Finds an incomes by its id
 *
 * @param {string|number} id
 * @throws A RecordNotFound error if the income does not exist.
 */
const findIncomeById = async (id) => {
  if (isInvalidId(id)) {
    throw new RecordNotFound(`Income ID ${id} not found.`);
  }

  const incomes = await db.table('transactions').where({ id, type: TRANSACTION_TYPE_INCOME }).limit(1);

  if (incomes.length === 0) {
    throw new RecordNotFound(`Income ID ${id} not found.`);
  }

  return transformDbRecordToIncome(incomes[0]);
};

/**
 * Persistes an incomes to the database
 *
 * @param {object} data
 */
const createIncome = async (data) => {
  const newIncome = await createTransaction({
    type: TRANSACTION_TYPE_INCOME,
    account_id: data.account_id,
    category_id: data.category_id,
    description: data.description,
    amount: data.amount,
    date: data.date,
  });

  return transformDbRecordToIncome(newIncome);
};

/**
 * Updates an income.
 *
 * @param {number} id
 * @param {object} data
 * @throws A RecordNotFound error if the income does not exist.
 */
const updateIncome = async (id, data) => {
  try {
    const updatedIncome = await updateTransaction(id, { ...data, type: TRANSACTION_TYPE_INCOME });
    return transformDbRecordToIncome(updatedIncome);
  } catch (error) {
    if (error instanceof RecordNotFound) {
      throw new RecordNotFound(`Income ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

/**
 * Deletes an income
 *
 * @param {number} id
 * @throws A RecordNotFound error if the income does not exist.
 */
const deleteIncome = async (id) => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_INCOME);
  } catch (error) {
    if (error instanceof RecordNotFound) {
      throw new RecordNotFound(`Income ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

module.exports = {
  listIncomes,
  findIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
};
