import { Type } from "@sinclair/typebox";
import { IntegerType, NumberType } from "../../types";
import { TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME, TRANSACTION_TYPE_TRANSFER } from "../constants";

const BaseTransactionSchemaProperties = {
  id: IntegerType,
  account_id: IntegerType,
  description: Type.String({ minLength: 3, maxLength: 255 }),
  amount: NumberType,
  date: Type.String({ format: "date-time" }),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
};

export const IncomeTransactionSchema = Type.Object({
  ...BaseTransactionSchemaProperties,
  type: Type.Literal(TRANSACTION_TYPE_INCOME),
  category_id: IntegerType,
  // transferred_to: Type.Optional(Type.Null()),
}, { $id: "IncomeTransaction" });

export const ExpenseTransactionSchema = Type.Object({
  ...BaseTransactionSchemaProperties,
  type: Type.Literal(TRANSACTION_TYPE_EXPENSE),
  category_id: IntegerType,
  // transferred_to: Type.Optional(Type.Null()),
}, { $id: "ExpenseTransaction" });

export const TransferTransactionSchema = Type.Object({
  ...BaseTransactionSchemaProperties,
  type: Type.Literal(TRANSACTION_TYPE_TRANSFER),
  // category_id: Type.Optional(Type.Null()),
  transferred_to: IntegerType,
}, { $id: "TransferTransaction" });

export const TransactionSchema = Type.Object({
  ...BaseTransactionSchemaProperties,
  type: Type.Union([
    Type.Literal(TRANSACTION_TYPE_INCOME),
    Type.Literal(TRANSACTION_TYPE_EXPENSE),
    Type.Literal(TRANSACTION_TYPE_TRANSFER),
  ]),
  category_id: Type.Optional(IntegerType),
  transferred_to: Type.Optional(IntegerType),
}, { $id: "Transaction" });
