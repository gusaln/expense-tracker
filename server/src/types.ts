import { Type } from "@sinclair/typebox";

export const IntegerType = Type.Union([Type.Integer(), Type.String({ pattern: "\\d+" })]);
export const SignedIntegerType = Type.Union([Type.Integer(), Type.String({ pattern: "-?\\d+" })]);

export const NumberType = Type.Union([Type.Number(), Type.String({ pattern: "\\d+(.\\d+)?" })]);
export const SignedNumberType = Type.Union([Type.Number(), Type.String({ pattern: "-?\\d+(.\\d+)?" })]);
