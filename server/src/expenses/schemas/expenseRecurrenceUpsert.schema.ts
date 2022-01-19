import { Type } from "@sinclair/typebox";
import RecurrenceSchema from "../../recurrentTransactions/schemas/recurrence.schema";

export default Type.Object({ ...RecurrenceSchema.properties }, { $id: "ExpenseRecurrenceUpsert" });
