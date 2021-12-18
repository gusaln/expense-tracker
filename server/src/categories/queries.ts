import db, { isInvalidId } from "../db";
import ApiError from "../errors/apiError";
import ResourceNotFoundError from "../errors/resourceNotFoundError";
import { Category, CategoryDbId, CategoryDbRecord, CategoryNew, CategoryUpdate } from "./types";

const transformDbRecordToCategory = (dbCategory: CategoryDbRecord): Category => ({
  id: Number(dbCategory.id),
  name: dbCategory.name,
  icon: dbCategory.icon,
  color: dbCategory.color,
  for_expenses: Boolean(dbCategory.for_expenses),
});

export type ListCategoriesFilters = { for_expenses?: boolean };

/**
 * Lists all the categories
 */
export const listCategories = async (filters: ListCategoriesFilters = {}) => {
  const builder = db.select().from<CategoryDbRecord>("categories");

  if (typeof filters.for_expenses === "boolean") {
    builder.where("for_expenses", filters.for_expenses);
  }

  return (await builder).map(transformDbRecordToCategory);
};

/**
 * Finds an categories by its id
 *
 * @throws {ResourceNotFoundError} if the category does not exist.
 */
export const findCategoryById = async (id: CategoryDbId): Promise<Category> => {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`Category ID ${id} not found.`);
  }

  const category = await db.from<CategoryDbRecord>("categories").where({ id }).first();

  if (!category) {
    throw new ResourceNotFoundError(`Category ID ${id} not found.`);
  }

  return transformDbRecordToCategory(category);
};

/**
 * Finds multiple categories by its their ids
 *
 * @throws {ResourceNotFoundError} if the category does not exist.
 */
export const findMultipleCategoriesById = async (
  ids: CategoryDbId | CategoryDbId[]
): Promise<Category[]> => {
  ids = Array.isArray(ids) ? ids : [ids];

  ids.forEach((id) => {
    if (isInvalidId(id)) {
      throw new ResourceNotFoundError(`Category ID ${id} not found.`);
    }
  });
  const categories = await db.from<CategoryDbRecord>("categories").whereIn("id", ids);

  if (categories.length !== ids.length) {
    throw new ResourceNotFoundError(`Category IDs ${ids} not found.`);
  }

  return categories.map(transformDbRecordToCategory);
};

/**
 * Persistes an categories to the database
 */
export const createCategory = async (data: CategoryNew): Promise<Category> => {
  const newCategories = await db
    .from<CategoryDbRecord>("categories")
    .insert({
      name: data.name,
      icon: data.icon,
      color: data.color,
      for_expenses: data.for_expenses,
    })
    .returning("*");

  return transformDbRecordToCategory(newCategories[0]);
};

/**
 * Updates an category.
 *
 * @throws {ResourceNotFoundError} if the category does not exist.
 */
export const updateCategory = async (id: CategoryDbId, data: CategoryUpdate): Promise<Category> => {
  // Checks if category exists
  await findCategoryById(id);

  const updatedCategories = await db
    .from<CategoryDbRecord>("categories")
    .where({ id })
    .update({
      name: data.name,
      icon: data.icon,
      color: data.color,
    })
    .returning("*");

  return transformDbRecordToCategory(updatedCategories[0]);
};

/**
 * Deletes an category
 *
 * @throws {ResourceNotFoundError} if the category does not exist.
 */
export const deleteCategory = async (id: CategoryDbId) => {
  // Checks if category exists
  await findCategoryById(id);

  const transactionsInCount = await db.count("id").from("transactions").where("category_id", id);
  if (transactionsInCount[0].count > 0) {
    throw new ApiError(
      "There are transactions in this category. As long as there are, the category can't be deleted."
    );
  }

  await db.from<CategoryDbRecord>("categories").where({ id }).del();
};
