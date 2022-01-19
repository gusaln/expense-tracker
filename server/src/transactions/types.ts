import { Static } from "@sinclair/typebox";
import { AccountDbId } from "../accounts/types";
import { CategoryDbId } from "../categories/types";
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER
} from "./constants";
import {
  ExpenseTransactionSchema,
  IncomeTransactionSchema,
  TransactionSchema,
  TransferTransactionSchema
} from "./schemas";

export type IncomeOrExpenseTransactionType =
  | typeof TRANSACTION_TYPE_INCOME
  | typeof TRANSACTION_TYPE_EXPENSE;
export type TransferTransactionType = typeof TRANSACTION_TYPE_TRANSFER;
export type TransactionType = IncomeOrExpenseTransactionType | TransferTransactionType;

export interface IncomeTransaction
  extends Omit<Static<typeof IncomeTransactionSchema>, "date" | "created_at" | "updated_at"> {
  date: Date;
  created_at: Date;
  updated_at: Date;
}
export interface ExpenseTransaction
  extends Omit<Static<typeof ExpenseTransactionSchema>, "date" | "created_at" | "updated_at"> {
  date: Date;
  created_at: Date;
  updated_at: Date;
}
export interface TransferTransaction
  extends Omit<Static<typeof TransferTransactionSchema>, "date" | "created_at" | "updated_at"> {
  date: Date;
  created_at: Date;
  updated_at: Date;
}

type WithTransactionType<T extends TransactionType = TransactionType> = T | { type: T };
type ExtractTransactionType<T extends WithTransactionType> = T extends { type: TransactionType }
  ? T["type"]
  : T;
// type WithTransactionType<T extends TransactionType = TransactionType> = { type: T }
// type ExtractTransactionType<T extends WithTransactionType> = T['type']

/** Any transaction */
export interface Transaction<TType extends TransactionType = TransactionType>
  extends Pick<Static<typeof TransactionSchema>, "id" | "account_id" | "recurrence_id" | "description" | "amount"> {
  type: TType;
  category_id: TType extends IncomeOrExpenseTransactionType ? CategoryDbId : undefined;
  transferred_to: TType extends TransferTransactionType ? AccountDbId : undefined;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

/** One type of transaction */
export type TransactionOfType<TType extends WithTransactionType> =
  ExtractTransactionType<TType> extends typeof TRANSACTION_TYPE_INCOME
    ? IncomeTransaction
    : ExtractTransactionType<TType> extends typeof TRANSACTION_TYPE_EXPENSE
    ? ExpenseTransaction
    : ExtractTransactionType<TType> extends typeof TRANSACTION_TYPE_TRANSFER
    ? TransferTransaction
    : Transaction;

export type TransactionNew<TType extends TransactionType = TransactionType> = {
  type: TType;
  account_id: AccountDbId;
  category_id: TType extends IncomeOrExpenseTransactionType ? CategoryDbId : undefined;
  transferred_to: TType extends TransferTransactionType ? AccountDbId : undefined;
} & Pick<Transaction, "recurrence_id" | "date" | "description" | "amount">;

export type TransactionUpdate<TType extends TransactionType = TransactionType> = {
  type: TType;
  account_id: AccountDbId;
  category_id: TType extends IncomeOrExpenseTransactionType ? CategoryDbId : undefined;
  transferred_to: TType extends TransferTransactionType ? AccountDbId : undefined;
} & Pick<Transaction, "recurrence_id" | "date" | "description" | "amount">;

// export type TransactionNew<TType extends WithTransactionType = TransactionType> =
//   ExtractTransactionType<TType> extends TransferTransactionType
//   ? Omit<TransferTransaction, 'id' | 'created_at' | 'updated_at'>
//   : Omit<IncomeTransaction | ExpenseTransaction, 'id' | 'created_at' | 'updated_at'>

//   export type TransactionUpdate<TType extends WithTransactionType = TransactionType> =
//   ExtractTransactionType<TType> extends TransferTransactionType
//   ? Omit<TransferTransaction, 'id' | 'created_at' | 'updated_at'>
//   : Omit<IncomeTransaction | ExpenseTransaction, 'id' | 'created_at' | 'updated_at'>

export type TransactionDbId = string | number;
export type TransactionDbRecord<TType extends TransactionType = TransactionType> = {
  id: TransactionDbId;
  type: TType;
  account_id: AccountDbId;
  category_id: TType extends typeof TRANSACTION_TYPE_TRANSFER ? undefined : CategoryDbId;
  transferred_to: TType extends typeof TRANSACTION_TYPE_TRANSFER ? AccountDbId : undefined;
} & Omit<Transaction, "id" | "type" | "account_id" | "category_id" | "transferred_to">;
