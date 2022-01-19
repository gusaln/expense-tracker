/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from "express";
import { findManyAccountsById } from "../accounts/queries";
import { findManyCategoriesById } from "../categories/queries";
import { CategoryDbId } from "../categories/types";
import { keyBy, unique } from "../utils/arrays";
import { parseDate } from "../utils/date";
import { TRANSACTION_TYPES } from "./constants";
import { listTransactions, ListTransactionsFilters, OrderBy } from "./queries";
import { findTransactionById } from "./queries/findTransactionById";

const transactionRoutes = Router();

function isValidSort(s?: string): boolean {
  return (
    !!s &&
    [
      "id",
      "account_id",
      "description",
      "amount",
      "category_id",
      "transferred_to",
      "date",
      "created_at",
      "updated_at",
    ].includes(s)
  );
}

// List transactions handler
transactionRoutes.get("/", async (req, res, next) => {
  try {
    const transactions = await listTransactions(
      {
        type:
          req.query.type && TRANSACTION_TYPES.includes(req.query.type as string)
            ? req.query.type
            : undefined,
        account_id: req.query.account_id,
        category_id: req.query.category_id,
        before: req.query.before ? parseDate(req.query.before as string).toDate() : undefined,
        after: req.query.after ? parseDate(req.query.after as string).toDate() : undefined,
      } as ListTransactionsFilters,
      isValidSort(req.query.sort as string) ? (req.query.sort as OrderBy) : undefined
    );

    const accounts = keyBy(
      await findManyAccountsById(
        unique(
          transactions
            .map((t) => t.account_id)
            .concat(transactions.map((t) => t.transferred_to) as number[])
            .filter((id) => id)
        )
      ),
      "id"
    );

    const categories = keyBy(
      await findManyCategoriesById(
        unique(transactions.map((t) => t.category_id).filter((id) => id)) as CategoryDbId[]
      ),
      "id"
    );

    res.json({
      data: transactions.map((t) => ({
        ...t,
        account: accounts[t.account_id],
        // @ts-ignore
        category: categories[t.category_id],
        // @ts-ignore
        transferred_to_account: accounts[t.transferred_to],
      })),
      total: transactions.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get an transaction handler
transactionRoutes.get("/:transaction", async (req, res, next) => {
  try {
    const transaction = await findTransactionById(req.params.transaction);

    res.json({ data: transaction });
  } catch (error) {
    next(error);
  }
});

export default transactionRoutes;
