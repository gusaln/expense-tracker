import { addBalanceToAccount, subtractBalanceToAccount } from '../../accounts/queries';
import { AccountDbId } from '../../accounts/types';
import db from '../../db';
import ResourceNotFoundError from '../../errors/resourceNotFoundError';
import { TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME, TRANSACTION_TYPE_TRANSFER } from '../constants';
import { TransactionDbId, TransactionType } from '../types';
import { findTransactionById } from './findTransactionById';

/**
 * Deletes a transaction
 *
 * @param type If given, it will only delete the transaction if it has this type. If
 *  the transaction does not have this type, {ResourceNotFoundError} will be thrown
 * @throws {ResourceNotFoundError} if the transaction does not exist.
 */

export async function deleteTransaction(id: TransactionDbId, type?: TransactionType) {
  // Checks if transaction exists
  const transaction = await findTransactionById(id);

  if (type && transaction.type !== type) {
    throw new ResourceNotFoundError(`Transaction ID ${id} not found.`);
  }

  db.transaction(async (trx) => {
    await trx.table('transactions').where({ id }).del();

    switch (transaction.type) {
      case TRANSACTION_TYPE_INCOME:
        await subtractBalanceToAccount(
          transaction.account_id, transaction.amount, trx
        );
        break;

      case TRANSACTION_TYPE_EXPENSE:
        await addBalanceToAccount(transaction.account_id, transaction.amount, trx);
        break;

      case TRANSACTION_TYPE_TRANSFER:
        await addBalanceToAccount(transaction.account_id, transaction.amount, trx);
        await subtractBalanceToAccount(transaction.transferred_to as AccountDbId, transaction.amount, trx);
        break;

      default:
        throw new Error(`Transaction has invalid type ${(transaction as any).type}.`);
    }
  });
}
