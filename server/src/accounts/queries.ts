import { Knex } from "knex";
import db, { isInvalidId } from "../db";
import ApiError from "../errors/apiError";
import ResourceNotFoundError from "../errors/resourceNotFoundError";
import Money from "../support/money/money";
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from "../transactions/constants";
import { Account, AccountDbId, AccountDbRecord, AccountNew, AccountUpdate } from "./types";

const transformDbRecordToAccount = (dbAccount: AccountDbRecord): Account => ({
  id: Number(dbAccount.id),
  name: dbAccount.name,
  icon: dbAccount.icon,
  color: dbAccount.color,
  currency: dbAccount.currency,
  current_balance: new Money(dbAccount.current_balance, dbAccount.currency),
  created_at: dbAccount.created_at,
  updated_at: dbAccount.updated_at,
});

/**
 * Lists all the accounts
 */
export const listAccounts = async () => {
  const accounts = await db.select().from<AccountDbRecord>("accounts");

  return accounts.map(transformDbRecordToAccount);
};

/**
 * Finds an accounts by its id
 *
 * @throws {ResourceNotFoundError} if the account does not exist.
 */
export const findAccountById = async (id: AccountDbId): Promise<Account> => {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`Account ID ${id} not found.`);
  }

  const account = await db.from<AccountDbRecord>("accounts").where({ id }).first();

  if (!account) {
    throw new ResourceNotFoundError(`Account ID ${id} not found.`);
  }

  return transformDbRecordToAccount(account);
};

/**
 * Finds many accounts by their ids
 *
 * @throws A ResourceNotFoundError error if the account does not exist.
 */
export const findManyAccountsById = async (ids: AccountDbId | AccountDbId[]) => {
  ids = Array.from(new Set(Array.isArray(ids) ? ids : [ids]));

  ids.forEach((id) => {
    if (isInvalidId(id)) {
      throw new ResourceNotFoundError(`Account ID ${id} not found.`);
    }
  });
  const accounts = await db.from<AccountDbRecord>("accounts").whereIn("id", ids);

  if (accounts.length !== ids.length) {
    throw new ResourceNotFoundError(`Account IDs ${ids.join(",")} not found.`);
  }

  return accounts.map(transformDbRecordToAccount);
};

/**
 * Persists an accounts to the database
 */
export const createAccount = async (data: AccountNew): Promise<Account> => {
  const newAccounts = await db
    .from<AccountDbRecord>("accounts")
    .insert({
      name: data.name,
      icon: data.icon,
      color: data.color,
      currency: data.currency.toUpperCase(),
      current_balance: 0,
    })
    .returning("*");

  return transformDbRecordToAccount(newAccounts[0]);
};

/**
 * Computes the balance of an account.
 *
 * @private
 */
const computeAccountBalance = async (id: AccountDbId) => {
  const incomesAgg = await db
    .select({ income: db.raw("sum(amount)") })
    .from("transactions")
    .where((builder) => builder.where({ type: TRANSACTION_TYPE_INCOME, account_id: id }))
    .orWhere({ transferred_to: id });

  const expensesAgg = await db
    .select({ expense: db.raw("sum(amount)") })
    .from("transactions")
    .whereIn("type", [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_TRANSFER])
    .where({ account_id: id });

  return incomesAgg[0].income - expensesAgg[0].expense;
};

/**
 * Updates an account.
 *
 * @throws {ResourceNotFoundError} if the account does not exist.
 */
export const updateAccount = async (id: AccountDbId, data: AccountUpdate) => {
  // Checks if account exists
  await findAccountById(id);

  const balance = await computeAccountBalance(id);

  const updatedAccounts = await db
    .from<AccountDbRecord>("accounts")
    .where({ id })
    .update({
      name: data.name,
      icon: data.icon,
      color: data.color,
      current_balance: balance,
      updated_at: new Date(),
    })
    .returning("*");

  return transformDbRecordToAccount(updatedAccounts[0]);
};

/**
 * Deletes an account
 *
 * @throws {ResourceNotFoundError} if the account does not exist.
 */
export const deleteAccount = async (id: AccountDbId) => {
  // Checks if account exists
  await findAccountById(id);

  const transactionsInCount = await db
    .from<AccountDbRecord>("transactions")
    .where("account_id", id)
    .orWhere("transferred_to", id)
    .count("id");

  if (transactionsInCount[0].count > 0) {
    throw new ApiError(
      "There are transactions in this account. As long as there are, the account can't be deleted."
    );
  }

  await db.from<AccountDbRecord>("accounts").where({ id }).del();
};

/**
 * Tries to add balance to an account.
 *
 * WARNING: This function does not check if the account exists.
 */
export const addBalanceToAccount = async (
  id: AccountDbId,
  amount: string | number,
  trx: Knex.Transaction
) =>
  trx
    .from<AccountDbRecord>("accounts")
    .where({ id })
    .update({
      current_balance: db.raw("current_balance + ?", [amount]),
      updated_at: new Date(),
    });

/**
 * Tries to subtract balance to an account.
 *
 * WARNING: This function does not check if the account exists.
 */
export const subtractBalanceToAccount = async (
  id: AccountDbId,
  amount: string | number,
  trx: Knex.Transaction
) =>
  trx
    .from<AccountDbRecord>("accounts")
    .where({ id })
    .update({
      current_balance: db.raw("current_balance - ?", [amount]),
      updated_at: new Date(),
    });
