import { Type } from "@sinclair/typebox";
import CategorySchema from "./category.schema";

export default Type.Omit(CategorySchema, ["id", "for_expenses"], { $id: "CategoryUpdate" });
