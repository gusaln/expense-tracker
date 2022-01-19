import { Knex } from "knex";
import { addBalanceToAccount, subtractBalanceToAccount } from "../../accounts/queries";
import { AccountDbId } from "../../accounts/types";
import db from "../../db";
import ApiError from "../../errors/apiError";
import { parseDate } from "../../utils/date";
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from "../constants";
import { TransactionDbRecord, TransactionNew, TransactionOfType, TransactionType } from "../types";
import { isValidAccountId } from "./isValidAccountId";
import { isValidCategoryId } from "./isValidCategoryId";
import { transformDbRecordToTransaction } from "./transformDbRecordToTransaction";

/**
 * Persists an transactions to the database
 */
export async function createTransaction<T extends TransactionType>(
  data: TransactionNew<T>,
  connection ?: Knex
): Promise<TransactionOfType<T>> {
  if (!(await isValidAccountId(data.account_id))) {
    throw new ApiError("Value of account_id is not a valid account ID.", 422);
  }

  if (data.type == TRANSACTION_TYPE_TRANSFER) {
    if (!(await isValidAccountId(data.transferred_to))) {
      throw new ApiError("Value of transferred_to is not a valid account ID.", 422);
    }
  } else {
    if (!(await isValidCategoryId(data.category_id))) {
      throw new ApiError("Value of category_id is not a valid category ID.", 422);
    }
  }

  const newTransactions = await (connection || db).transaction(async (trx) => {
    switch (data.type) {
      case TRANSACTION_TYPE_INCOME:
        await addBalanceToAccount(data.account_id, data.amount, trx);
        break;

      case TRANSACTION_TYPE_EXPENSE:
        await subtractBalanceToAccount(data.account_id, data.amount, trx);
        break;

      case TRANSACTION_TYPE_TRANSFER:
        await subtractBalanceToAccount(data.account_id, data.amount, trx);
        await addBalanceToAccount(data.transferred_to as AccountDbId, data.amount, trx);
        break;

      default:
        throw new Error(`Transaction has invalid type ${data.type}.`);
    }

    return await trx
      .into<TransactionDbRecord<T>>("transactions")
      .insert({
        type: data.type,
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        transferred_to: data.transferred_to,
        amount: data.amount,
        date: parseDate(data.date).toDate(),
      } as TransactionDbRecord<T>)
      .returning("*");
  });

  return transformDbRecordToTransaction(newTransactions[0]) as TransactionOfType<T>;
}
