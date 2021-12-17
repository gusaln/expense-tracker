import db, { isInvalidId } from '../db';
import ResourceNotFoundError from '../errors/resourceNotFoundError';
import { TRANSACTION_TYPE_TRANSFER } from '../transactions/constants';
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../transactions/queries';
import { TransactionDbRecord, TransactionNew, TransferTransaction } from '../transactions/types';
import { Transfer, TransferDbId, TransferNew, TransferUpdate } from './types';

type TransferSelector = typeof TRANSACTION_TYPE_TRANSFER;

const transformDbRecordToTransfer = (dbTransfer: TransactionDbRecord<TransferSelector>): Transfer => ({
  id: Number(dbTransfer.id),
  account_id: Number(dbTransfer.account_id),
  description: dbTransfer.description,
  amount: Number(dbTransfer.amount),
  transferred_to: Number(dbTransfer.transferred_to),
  date: dbTransfer.date,
  created_at: dbTransfer.created_at,
  updated_at: dbTransfer.updated_at,
});

const transformTransferTransactionToTransfer = (dbTransfer: TransferTransaction): Transfer => ({
  id: Number(dbTransfer.id),
  account_id: Number(dbTransfer.account_id),
  description: dbTransfer.description,
  amount: Number(dbTransfer.amount),
  transferred_to: Number(dbTransfer.transferred_to),
  date: dbTransfer.date,
  created_at: dbTransfer.created_at,
  updated_at: dbTransfer.updated_at,
});

/**
 * Lists all the transfers
 */
export const listTransfers = async (): Promise<Transfer[]> => {
  const transfers = (await listTransactions({ type: TRANSACTION_TYPE_TRANSFER }, ['date', 'desc']) as TransferTransaction[]);

  return transfers.map(transformTransferTransactionToTransfer);
};

/**
 * Finds an transfers by its id
 *
 * @throws {ResourceNotFound} if the transfer does not exist.
 */
export const findTransferById = async (id: TransferDbId): Promise<Transfer> => {
  if (isInvalidId(id)) {
    throw new ResourceNotFoundError(`Transfer ID ${id} not found.`);
  }

  const transfer = await db.from<TransactionDbRecord<'transfer'>>('transactions')
    .where({ id, type: TRANSACTION_TYPE_TRANSFER })
    .first();

  if (!transfer) {
    throw new ResourceNotFoundError(`Transfer ID ${id} not found.`);
  }

  return transformDbRecordToTransfer(transfer);
};

/**
 * Persistes an transfers to the database
 */
export const createTransfer = async (data: TransferNew): Promise<Transfer> => {
  const newTransfer = await createTransaction({
    type: TRANSACTION_TYPE_TRANSFER,
    account_id: data.account_id,
    transferred_to: data.transferred_to,
    description: data.description,
    amount: data.amount,
    date: data.date,
  } as TransactionNew<'transfer'>);

  return transformTransferTransactionToTransfer(newTransfer);
};

/**
 * Updates an transfer.
 *
 * @throws {ResourceNotFound} if the transfer does not exist.
 */
export const updateTransfer = async (id: TransferDbId, data: TransferUpdate): Promise<Transfer> => {
  try {
    const updatedTransfer = await updateTransaction(
      id,
      {
        account_id: data.account_id,
        description: data.description,
        amount: data.amount,
        transferred_to: data.transferred_to,
        date: data.date,
      } as TransactionNew<'transfer'>
    );
    return transformTransferTransactionToTransfer(updatedTransfer);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Transfer ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

/**
 * Deletes an transfer
 *
 * @throws {ResourceNotFound} if the transfer does not exist.
 */
export const deleteTransfer = async (id: TransferDbId): Promise<void> => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_TRANSFER);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError(`Transfer ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};