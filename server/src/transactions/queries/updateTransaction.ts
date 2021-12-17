import { addBalanceToAccount, subtractBalanceToAccount } from '../../accounts/queries';
import db from '../../db';
import ApiError from '../../errors/apiError';
import ResourceNotFoundError from '../../errors/resourceNotFoundError';
import { parseDate } from '../../utils/date';
import { TRANSACTION_TYPE_INCOME } from '../constants';
import { IncomeOrExpenseTransactionType, TransactionDbId, TransactionDbRecord, TransactionOfType, TransactionType, TransactionUpdate, TransferTransactionType } from '../types';
import { findTransactionById } from './findTransactionById';
import { isValidAccountId } from './isValidAccountId';
import { isValidCategoryId } from './isValidCategoryId';
import { transformDbRecordToTransaction } from './transformDbRecordToTransaction';

/**
 * Persistes changes made to a transaction
 *
 * @throws {ResourceNotFoundError} if the transaction does not exist.
 */
 export const updateTransaction = async <T extends TransactionType>(id: TransactionDbId, data: TransactionUpdate<T>)
 : Promise<TransactionOfType<T>> => {
 const oldData = await findTransactionById(id);

 if (oldData.type !== data.type) {
   throw new ResourceNotFoundError(`Transaction ID ${id} not found.`);
 }

 if (!await isValidAccountId(data.account_id)) {
   throw new ApiError('Value of account_id is not a valid account ID.', 422);
 }

 const amountDiff = (data.amount as number) - (oldData.amount as number);
 const updatedRecords = data.type == 'transfer'
   ? await updateTransferTransaction(id, data as TransactionUpdate<TransferTransactionType>, amountDiff)
   : await updateIncomeOrExpenseTransaction(id, data as TransactionUpdate<IncomeOrExpenseTransactionType>, amountDiff);

 return transformDbRecordToTransaction(updatedRecords[0]) as TransactionOfType<T>;
};

const updateIncomeOrExpenseTransaction = async (
 id: TransactionDbId,
 data: TransactionUpdate<IncomeOrExpenseTransactionType>,
 amountDiff: number
) => {
 if (data.category_id && !await isValidCategoryId(data.category_id)) {
   throw new ApiError('Value of category_id is not a valid category ID.', 422);
 }

 return await db.transaction(async (trx) => {
   if (data.type == TRANSACTION_TYPE_INCOME) {
       await addBalanceToAccount(data.account_id, amountDiff, trx);
   } else {
     await subtractBalanceToAccount(data.account_id, amountDiff, trx);

   }

   return await trx
     .into<TransactionDbRecord>('transactions')
     .where({ id })
     .update({
       account_id: data.account_id,
       category_id: data.category_id,
       description: data.description,
       amount: data.amount,
       date: parseDate(data.date).toDate(),
       updated_at: new Date(),
     })
     .returning('*');
 });
};

const updateTransferTransaction = async (id: TransactionDbId, data: TransactionUpdate<TransferTransactionType>, amountDiff: number) => {
 if (data.transferred_to && !await isValidAccountId(data.transferred_to)) {
   throw new ApiError('Value of transferred_to is not a valid account ID.', 422);
 }

 return await db.transaction(async (trx) => {
   const t = await trx
     .into<TransactionDbRecord>('transactions')
     .where({ id })
     .update({
       account_id: data.account_id,
       description: data.description,
       transferred_to: data.transferred_to,
       amount: data.amount,
       date: parseDate(data.date).toDate(),
       updated_at: new Date(),
     })
     .returning('*');

   await subtractBalanceToAccount(data.account_id, amountDiff, trx);
   await addBalanceToAccount(data.transferred_to, amountDiff, trx);

   return t;
 });
};