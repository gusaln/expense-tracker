import { Type } from "@sinclair/typebox";
import { NumberType } from "../../types";

export default Type.Object(
  {
    id: Type.Integer(),
    name: Type.String({ minLength: 3, maxLength: 255 }),
    icon: Type.String({ minLength: 3, maxLength: 50 }),
    color: Type.String({ pattern: "[#]([0-9a-f]{3}|[0-9a-f]{6})" }),
    currency: Type.String({ minLength: 3, maxLength: 3 }),
    current_balance: NumberType,
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
  },
  { $id: "Account" }
);
