import { Static } from "@sinclair/typebox";
import CategorySchema from "./schemas/category.schema";

export type Category = Static<typeof CategorySchema>;

export type CategoryNew = Omit<Category, "id">;
export type CategoryUpdate = Omit<Category, "id" | "for_expenses">;

export type CategoryDbId = string | number;
export type CategoryDbRecord = Omit<Category, "id"> & { id: CategoryDbId };
