const db = require('../../database/connection');
const { TRANSACTION_TYPE_INCOME, TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_TRANSFER } = require('./contants');
const RecordNotFound = require('../errors/RecordNotFound');
const { findCategoryById } = require('../categories/queries');
const { findAccountById, addBalanceToAccount, substractBalanceToAccount } = require('../accounts/queries');
const { parseDate } = require('../utils/date');
const ApiError = require('../errors/ApiError');

const transformDbRecordToTransaction = (dbTransaction) => ({
  id: Number(dbTransaction.id),
  type: dbTransaction.type,
  account_id: Number(dbTransaction.account_id),
  category_id: Number(dbTransaction.category_id),
  description: dbTransaction.description,
  amount: Number(dbTransaction.amount),
  transfered_to: dbTransaction.transfered_to ? Number(dbTransaction.transfered_to) : null,
  date: dbTransaction.date,
  created_at: dbTransaction.created_at,
  updated_at: dbTransaction.updated_at,
});

const isInvalidId = (id) => Number.isNaN(parseInt(id, 10));

/**
 * Checks if a category exists by its Id.
 *
 * @param {number} categoryId
 * @returns {Promise<boolean>}
 */
const isValidCategoryId = async (categoryId) => {
  try {
    await findCategoryById(categoryId);

    return true;
  } catch (error) {
    if (error instanceof RecordNotFound) {
      return false;
    }

    throw error;
  }
};

/**
 * Checkes if an account exists by its Id.
 *
 * @param {number} accountId
 * @returns {Promise<boolean>}
 */
const isValidAccountId = async (accountId) => {
  try {
    await findAccountById(accountId);

    return true;
  } catch (error) {
    if (error instanceof RecordNotFound) {
      return false;
    }

    throw error;
  }
};

/**
 * Lists transactions.
 *
 * @param {Record<string,any>} filters
 * @param {string|[string,'asc'|'desc']} orderBy
 */
const listTransactions = async (filters = {}, orderBy = null) => {
  const query = db.select().from('transactions');

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
    let direction = 'asc';
    [orderBy, direction] = Array.isArray(orderBy) ? orderBy : [orderBy, direction];

    query.orderBy(orderBy, direction);
  }

  const transactions = await query;

  return transactions.map(transformDbRecordToTransaction);
};

/**
 * Finds an transactions by its id
 *
 * @param {string|number} id
 * @throws A RecordNotFound error if the transaction does not exist.
 */
const findTransactionById = async (id) => {
  if (isInvalidId(id)) {
    throw new RecordNotFound(`Transaction ID ${id} not found.`);
  }

  const transactions = await db.table('transactions').where({ id }).limit(1);

  if (transactions.length === 0) {
    throw new RecordNotFound(`Transaction ID ${id} not found.`);
  }

  return transformDbRecordToTransaction(transactions[0]);
};

/**
 * Persistes an transactions to the database
 *
 * @param {object} data
 */
const createTransaction = async (data) => {
  let newTransactions = null;

  if (!await isValidAccountId(data.account_id)) {
    throw new ApiError('Value of account_id is not a valid account ID.', 422);
  }

  if (data.category_id && !await isValidCategoryId(data.category_id)) {
    throw new ApiError('Value of category_id is not a valid category ID.', 422);
  }

  if (data.transfered_to && !await isValidAccountId(data.transfered_to)) {
    throw new ApiError('Value of transfered_to is not a valid account ID.', 422);
  }

  await db.transaction(async (trx) => {
    const date = data.date ? parseDate(data.date) : null;

    newTransactions = await trx
      .into('transactions')
      .insert({
        type: data.type,
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        transfered_to: data.transfered_to,
        amount: data.amount,
        date,
      })
      .returning('*');

    switch (data.type) {
      case TRANSACTION_TYPE_INCOME:
        await addBalanceToAccount(data.account_id, data.amount, trx);
        break;

      case TRANSACTION_TYPE_EXPENSE:
        await substractBalanceToAccount(data.account_id, data.amount, trx);
        break;

      case TRANSACTION_TYPE_TRANSFER:
        await substractBalanceToAccount(data.account_id, data.amount, trx);
        await addBalanceToAccount(data.transfered_to, data.amount, trx);
        break;

      default:
        throw new Error(`Transaction has invalid type ${data.type}.`);
    }
  });

  return transformDbRecordToTransaction(newTransactions[0]);
};

/**
 * Persistes changes made to a transaction
 *
 * @param {number} id
 * @param {object} data
 *
 * @throws A RecordNotFound error if the transaction does not exist.
 */
const updateTransaction = async (id, data) => {
  const oldData = await findTransactionById(id);

  if (oldData.type !== data.type) {
    throw new RecordNotFound(`Transaction ID ${id} not found.`);
  }

  if (!await isValidAccountId(data.account_id)) {
    throw new ApiError('Value of account_id is not a valid account ID.', 422);
  }

  if (data.category_id && !await isValidCategoryId(data.category_id)) {
    throw new ApiError('Value of category_id is not a valid category ID.', 422);
  }

  if (data.transfered_to && !await isValidAccountId(data.transfered_to)) {
    throw new ApiError('Value of transfered_to is not a valid account ID.', 422);
  }

  let updatedTransactions = null;

  await db.transaction(async (trx) => {
    const date = data.date ? parseDate(data.date) : null;

    updatedTransactions = await trx
      .into('transactions')
      .where({ id })
      .update({
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        transfered_to: data.transfered_to,
        amount: data.amount,
        date,
        updated_at: new Date()
      })
      .returning('*');

    const amountDiff = data.amount - oldData.amount;

    switch (data.type) {
      case TRANSACTION_TYPE_INCOME:
        await addBalanceToAccount(data.account_id, amountDiff, trx);
        break;

      case TRANSACTION_TYPE_EXPENSE:
        await substractBalanceToAccount(data.account_id, amountDiff, trx);
        break;

      case TRANSACTION_TYPE_TRANSFER:
        await substractBalanceToAccount(data.account_id, amountDiff, trx);
        await addBalanceToAccount(data.transfered_to, amountDiff, trx);
        break;

      default:
        throw new Error(`Transaction has invalid type ${data.type}.`);
    }
  });

  return transformDbRecordToTransaction(updatedTransactions[0]);
};

/**
 * Deletes a transaction
 *
 * @param {number} id
 * @param {string|null} type If given, it will only delete the transaction if it has this type. If
 *  the transaction does not have this type, a RecordNotFound error will be thrown
 * @throws A RecordNotFound error if the transaction does not exist.
 */
const deleteTransaction = async (id, type = null) => {
  // Checks if transaction exists
  const transaction = await findTransactionById(id);

  if (type && transaction.type !== type) {
    throw new RecordNotFound(`Transaction ID ${id} not found.`);
  }

  db.transaction(async (trx) => {
    await trx.table('transactions').where({ id }).del();

    switch (transaction.type) {
      case TRANSACTION_TYPE_INCOME:
        await substractBalanceToAccount(
          transaction.account_id, transaction.amount, trx
        );
        break;

      case TRANSACTION_TYPE_EXPENSE:
        await addBalanceToAccount(transaction.account_id, transaction.amount, trx);
        break;

      case TRANSACTION_TYPE_TRANSFER:
        await addBalanceToAccount(transaction.account_id, transaction.amount, trx);
        await substractBalanceToAccount(transaction.transfered_to, transaction.amount, trx);
        break;

      default:
        throw new Error(`Transaction has invalid type ${transaction.type}.`);
    }
  });
};

module.exports = {
  listTransactions,
  findTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
