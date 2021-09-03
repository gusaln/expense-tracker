const db = require('../../database/connection');
const { Money } = require('../support/money');
const ApiError = require('../errors/ApiError');
const RecordNotFound = require('../errors/RecordNotFound');
const {
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_TRANSFER,
} = require('../transactions/contants');

const transformDbRecordToAccount = (dbAccount) => ({
  id: Number(dbAccount.id),
  name: dbAccount.name,
  icon: dbAccount.icon,
  color: dbAccount.color,
  currency: dbAccount.currency,
  current_balance: new Money(dbAccount.current_balance, dbAccount.currency),
  created_at: dbAccount.created_at,
  updated_at: dbAccount.updated_at,
});

const isInvalidId = (id) => Number.isNaN(parseInt(id, 10));

/**
 * Lists all the accounts
 */
const listAccounts = async () => {
  const accounts = await db.select().from('accounts');

  return accounts.map(transformDbRecordToAccount);
};

/**
 * Finds an accounts by its id
 *
 * @param {string|number} id
 * @throws A RecordNotFound error if the account does not exist.
 */
const findAccountById = async (id) => {
  if (isInvalidId(id)) {
    throw new RecordNotFound(`Account ID ${id} not found.`);
  }

  const accounts = await db.table('accounts').where({ id }).limit(1);

  if (accounts.length === 0) {
    throw new RecordNotFound(`Account ID ${id} not found.`);
  }

  return transformDbRecordToAccount(accounts[0]);
};

/**
 * Finds multiple accounts by its their ids
 *
 * @param {string[]|number[]} ids
 * @throws A RecordNotFound error if the account does not exist.
 */
const findMultipleAccountsById = async (ids) => {
  ids = Array.isArray(ids) ? ids : [ids];

  ids.forEach((id) => {
    if (isInvalidId(id)) {
      throw new RecordNotFound(`Account ID ${id} not found.`);
    }
  });
  const accounts = await db.table('accounts').whereIn('id', ids);

  if (accounts.length !== ids.length) {
    throw new RecordNotFound(`Account IDs ${ids} not found.`);
  }

  return accounts.map(transformDbRecordToAccount);
};

/**
 * Persistes an accounts to the database
 *
 * @param {object} data
 */
const createAccount = async (data) => {
  const newAccounts = await db
    .table('accounts')
    .insert({
      name: data.name,
      icon: data.icon,
      color: data.color,
      currency: data.currency.toUpperCase(),
      current_balance: 0,
    })
    .returning('*');

  return transformDbRecordToAccount(newAccounts[0]);
};

/**
 * Computes the balance of an account.
 *
 * @private
 *
 * @param {number} id
 */
const computeAccountBalance = async (id) => {
  const incomesAgg = await db
    .select({ income: db.raw('sum(amount)') })
    .from('transactions')
    .where((builder) => builder.where({ type: TRANSACTION_TYPE_INCOME, account_id: id }))
    .orWhere({ transfered_to: id });

  const expensesAgg = await db
    .select({ expense: db.raw('sum(amount)') })
    .from('transactions')
    .whereIn('type', [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_TRANSFER])
    .where({ account_id: id });

  return incomesAgg[0].income - expensesAgg[0].expense;
};

/**
 * Updates an account.
 *
 * @param {number} id
 * @param {object} data
 * @throws A RecordNotFound error if the account does not exist.
 */
const updateAccount = async (id, data) => {
  // Checks if account exists
  await findAccountById(id);

  const balance = await computeAccountBalance(id);

  const updatedAccounts = await db
    .table('accounts')
    .where({ id })
    .update({
      name: data.name,
      icon: data.icon,
      color: data.color,
      current_balance: balance,
      updated_at: new Date(),
    })
    .returning('*');

  return transformDbRecordToAccount(updatedAccounts[0]);
};

/**
 * Deletes an account
 *
 * @param {number} id
 * @throws A RecordNotFound error if the account does not exist.
 */
const deleteAccount = async (id) => {
  // Checks if account exists
  await findAccountById(id);

  const transactionsInCount = await db.count('id').from('transactions').where('account_id', id).orWhere('transfered_to', id);
  if (transactionsInCount[0].count > 0) {
    throw new ApiError("There are transactions in this account. As long as there are, the account can't be deleted.", 400);
  }

  await db.table('accounts').where({ id }).del();
};

/**
 * Tries to add balance to an account.
 *
 * WARNING: This function does not check if the account exists.
 *
 * @param {number} id
 * @param {number} amount
 * @param {import('knex').Knex.Transaction} trx
 */
const addBalanceToAccount = async (id, amount, trx) => trx
  .table('accounts')
  .where({ id })
  .update({
    current_balance: db.raw('current_balance + ?', [amount]),
    updated_at: new Date(),
  });

/**
 * Tries to substract balance to an account.
 *
 * WARNING: This function does not check if the account exists.
 *
 * @param {number} id
 * @param {number} amount
 * @param {import('knex').Knex.Transaction} trx
 */
const substractBalanceToAccount = async (id, amount, trx) => trx
  .table('accounts')
  .where({ id })
  .update({
    current_balance: db.raw('current_balance - ?', [amount]),
    updated_at: new Date(),
  });

module.exports = {
  listAccounts,
  findAccountById,
  findMultipleAccountsById,
  createAccount,
  updateAccount,
  deleteAccount,
  addBalanceToAccount,
  substractBalanceToAccount,
};
