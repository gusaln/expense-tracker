import { Type } from "@sinclair/typebox";
import { IntegerType, NumberType } from "../../types";
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER
} from "../constants";

export const BaseTransactionSchemaProperties = {
  account_id: IntegerType,
  description: Type.String({ minLength: 3, maxLength: 255 }),
  amount: NumberType,
  date: Type.String({ format: "date-time" }),
};

export const IncomeTransactionSchema = Type.Object(
  {
    id: IntegerType,
    type: Type.Literal(TRANSACTION_TYPE_INCOME),
    recurrence_id: Type.Optional(IntegerType),
    ...BaseTransactionSchemaProperties,
    category_id: IntegerType,
    // transferred_to: Type.Optional(Type.Null()),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
  },
  { $id: "IncomeTransaction" }
);

export const ExpenseTransactionSchema = Type.Object(
  {
    id: IntegerType,
    type: Type.Literal(TRANSACTION_TYPE_EXPENSE),
    recurrence_id: Type.Optional(IntegerType),
    ...BaseTransactionSchemaProperties,
    category_id: IntegerType,
    // transferred_to: Type.Optional(Type.Null()),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
  },
  { $id: "ExpenseTransaction" }
);

export const TransferTransactionSchema = Type.Object(
  {
    id: IntegerType,
    type: Type.Literal(TRANSACTION_TYPE_TRANSFER),
    ...BaseTransactionSchemaProperties,
    // category_id: Type.Optional(Type.Null()),
    transferred_to: IntegerType,
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
  },
  { $id: "TransferTransaction" }
);

export const TransactionSchema = Type.Object(
  {
    id: IntegerType,
    type: Type.Union([
      Type.Literal(TRANSACTION_TYPE_INCOME),
      Type.Literal(TRANSACTION_TYPE_EXPENSE),
      Type.Literal(TRANSACTION_TYPE_TRANSFER),
    ]),
    recurrence_id: Type.Optional(IntegerType),
    ...BaseTransactionSchemaProperties,
    category_id: Type.Optional(IntegerType),
    transferred_to: Type.Optional(IntegerType),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
  },
  { $id: "Transaction" }
);
