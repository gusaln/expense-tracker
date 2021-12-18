import { AccountDbId } from "../accounts/types";
import db from "../db";
import { TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME } from "../transactions/constants";
import { BalanceByCurrency } from "./type";

/**
 * Retrieves the total balance for all the accounts grouped by currency.
 */
export const getBalancesByCurrency = async (): Promise<BalanceByCurrency> => {
  const balances = await db
    .table("accounts")
    .groupBy("currency")
    .select(["currency", db.raw("sum(current_balance) as balance")]);

  return balances.reduce(
    (balanceByCurrency, balance) => ({ ...balanceByCurrency, [balance.currency]: balance.balance }),
    {}
  );
};

/**
 * Computes a income report for the given period.
 *
 * @todo Handle multiple currencies
 */
export const getIncomeReport = async (
  after: Date,
  before: Date,
  accountId?: AccountDbId
): Promise<BalanceByCurrency> => {
  const query = db
    .table("transactions")
    .innerJoin("accounts", "accounts.id", "=", "transactions.account_id")
    .where("type", TRANSACTION_TYPE_INCOME)
    .whereBetween("date", [after, before]);

  if (accountId) {
    query.where("account_id", accountId);
  }

  const incomes = await query
    .groupBy("accounts.currency")
    .select(["accounts.currency", db.raw("sum(transactions.amount) as sum")]);

  return incomes.reduce(
    (incomeByCurrency, income) => ({ ...incomeByCurrency, [income.currency]: income.sum }),
    {}
  );
};

/**
 * Computes a expense report for the given period.
 *
 * @todo Handle multiple currencies
 */
export const getExpenseReport = async (
  after: Date,
  before: Date,
  accountId?: AccountDbId
): Promise<BalanceByCurrency> => {
  const query = db
    .table("transactions")
    .innerJoin("accounts", "accounts.id", "=", "transactions.account_id")
    .where("type", TRANSACTION_TYPE_EXPENSE)
    .whereBetween("date", [after, before]);

  if (accountId) {
    query.where("account_id", accountId);
  }

  const expenses = await query
    .groupBy("accounts.currency")
    .select(["accounts.currency", db.raw("sum(transactions.amount) as sum")]);

  return expenses.reduce(
    (expenseByCurrency, expense) => ({ ...expenseByCurrency, [expense.currency]: expense.sum }),
    {}
  );
};
