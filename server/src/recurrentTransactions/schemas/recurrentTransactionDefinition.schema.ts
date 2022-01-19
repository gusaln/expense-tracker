import { Type } from "@sinclair/typebox";
import { IntegerType, SignedIntegerType } from "../../types";

const UnsignedIntegerListType = Type.Array(IntegerType);
const SignedIntegerListType = Type.Array(SignedIntegerType);

/**
 * Exert of properties of a RECUR.
 *
 * Some considerations:
 * - The types of some properties define format instead of syntax for simplicity.
 * - The INTERVAL and COUNT properties have an arbitrary limit.
 *
 * The original definition date back to 1998 in RFC 2445.
 * @see <https://datatracker.ietf.org/doc/html/rfc2445#section-4.3.10>
 *
 * RFC 2445 was obsoleted by RFC5545 in 2009.
 * No significant changes where made to the grammar of RECUR.
 * @see <https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10>
 */
export const RecurProperties = {
  recur_freq: Type.Union([
    Type.Literal("SECONDLY"),
    Type.Literal("MINUTELY"),
    Type.Literal("HOURLY"),
    Type.Literal("DAILY"),
    Type.Literal("WEEKLY"),
    Type.Literal("MONTHLY"),
    Type.Literal("YEARLY"),
  ]),
  recur_interval: Type.Union([
    Type.Integer({ minimum: 1, maximum: 65535 }),
    Type.String({ pattern: "\\d+" }),
  ]),
  recur_wkst: Type.Optional(
    Type.Union([
      Type.Literal("MO"),
      Type.Literal("TU"),
      Type.Literal("WE"),
      Type.Literal("TH"),
      Type.Literal("FR"),
      Type.Literal("SA"),
      Type.Literal("SU"),
    ])
  ),
  recur_bymonth: Type.Optional(UnsignedIntegerListType),
  recur_byweekno: Type.Optional(UnsignedIntegerListType),
  recur_byyearday: Type.Optional(UnsignedIntegerListType),
  recur_bymonthday: Type.Optional(UnsignedIntegerListType),
  recur_byday: Type.Optional(
    Type.Array(Type.String({ maxLength: 5, pattern: "-?(\\d{1,2})\\w{2}" }))
  ),
  recur_byhour: Type.Optional(UnsignedIntegerListType),
  recur_byminute: Type.Optional(UnsignedIntegerListType),
  recur_bysecond: Type.Optional(UnsignedIntegerListType),
  recur_bysetpos: Type.Optional(SignedIntegerListType),
  recur_until: Type.Optional(Type.String({ format: "date-time" })),
  recur_count: Type.Optional(Type.Integer({ minimum: 1, maximum: 65535 })),
};

export const RecurrentTransactionUpdateModeType = Type.Union([
  Type.Literal("single"),
  Type.Literal("all_in_series_before"),
  Type.Literal("all_in_series"),
]);

export default Type.Object(
  {
    id: Type.Number(),
    name: Type.String({ minLength: 3, maxLength: 256 }),
    base_transaction_id: IntegerType,
    last_transaction_date: Type.String({ format: "date-time" }),

    ...RecurProperties,

    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
    finished_at: Type.Optional(Type.String({ format: "date-time" })),
  },
  { $id: "RecurrentTransaction" }
);
