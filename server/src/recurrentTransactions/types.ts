import { Static } from "@sinclair/typebox";
import { Frequency, WeekdayStr } from "rrule";
import { TransactionDbId } from "../transactions/types";
import RecurrentTransactionSchema from "./schemas/recurrentTransactionDefinition.schema";

export enum RecurrentTransactionUpdateMode {
  SINGLE = 1,
  ALL_IN_SERIES_BEFORE = 2,
  ALL_IN_SERIES = 3,
}
export type RecurrentTransactionUpdateModeKeys = Lowercase<
  keyof typeof RecurrentTransactionUpdateMode
>;

export interface RecurrentTransactionDefinition
  extends Omit<
    Static<typeof RecurrentTransactionSchema>,
    "last_transaction_date" | "recur_interval" | "recur_until" | "created_at" | "updated_at" | "finished_at"
  > {
  last_transaction_date: Date;
  recur_interval: number;
  recur_until?: Date;
  created_at: Date;
  updated_at: Date;
  finished_at?: Date;
}

export type RecurrentTransactionDefinitionNew = Omit<
  RecurrentTransactionDefinition,
  "id" | "created_at" | "updated_at" | "finished_at"
>;
export type RecurrentTransactionDefinitionUpdate = Omit<
  RecurrentTransactionDefinition,
  "id" | "created_at" | "updated_at" | "finished_at"
>;

export type RecurrentTransactionDefinitionDbId = string | number;
export type DbInteger = string | number;
export interface RecurrentTransactionDefinitionDbRecord {
  id: RecurrentTransactionDefinitionDbId;
  name: string;
  base_transaction_id: TransactionDbId;
  last_transaction_date: Date;
  recur_freq: keyof typeof Frequency;
  recur_interval: number;
  recur_wkst?: WeekdayStr;
  recur_bymonth?: string;
  recur_byweekno?: string;
  recur_byyearday?: string;
  recur_bymonthday?: string;
  recur_byday?: string;
  recur_byhour?: string;
  recur_byminute?: string;
  recur_bysecond?: string;
  recur_bysetpos?: string;
  recur_until?: Date;
  recur_count?: DbInteger;
  created_at: Date;
  updated_at: Date;
  finished_at: Date;
}