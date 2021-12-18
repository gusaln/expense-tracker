import { Type } from "@sinclair/typebox";
import { IncomeTransactionSchema } from "../../transactions/schemas";

const IncomeSchema = Type.Omit(IncomeTransactionSchema, ["type"], { $id: "Income" });

export default IncomeSchema;
