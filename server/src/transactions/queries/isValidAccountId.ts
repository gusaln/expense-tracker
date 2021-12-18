import { findAccountById } from "../../accounts/queries";
import { AccountDbId } from "../../accounts/types";
import ResourceNotFoundError from "../../errors/resourceNotFoundError";

/**
 * Checks if an account exists by its Id.
 */
export async function isValidAccountId(accountId?: AccountDbId): Promise<boolean> {
  if (!accountId) return false;

  try {
    await findAccountById(accountId);

    return true;
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return false;
    }

    throw error;
  }
}
