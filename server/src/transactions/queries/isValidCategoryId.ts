import { findCategoryById } from "../../categories/queries";
import { CategoryDbId } from "../../categories/types";
import ResourceNotFoundError from "../../errors/resourceNotFoundError";

/**
 * Checks if a category exists by its Id.
 */
export async function isValidCategoryId(categoryId?: CategoryDbId): Promise<boolean> {
  if (!categoryId) return false;

  try {
    await findCategoryById(categoryId);

    return true;
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return false;
    }

    throw error;
  }
}
