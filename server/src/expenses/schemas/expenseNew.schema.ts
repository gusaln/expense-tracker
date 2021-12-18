import { Type } from "@sinclair/typebox";
import ExpenseSchema from "./expense.schema";

export default Type.Omit(ExpenseSchema, ["id", "created_at", "updated_at"], { $id: "ExpenseNew" });
