import { Static } from "@sinclair/typebox";
import { TransferTransaction } from "../transactions/types";
import TransferNewSchema from "./schemas/transferNew.schema";
import TransferUpdateSchema from "./schemas/transferUpdate.schema";

export type Transfer = Omit<TransferTransaction, "type">;

export type TransferNew = Omit<Static<typeof TransferNewSchema>, "date"> & { date: Date };
export type TransferUpdate = Omit<Static<typeof TransferUpdateSchema>, "date"> & { date: Date };

export type TransferDbId = string | number;
export type TransferDbRecord = Omit<Transfer, "id"> & { id: TransferDbId };
