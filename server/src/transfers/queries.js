const db = require('../../database/connection');
const RecordNotFound = require('../errors/RecordNotFound');
const { TRANSACTION_TYPE_TRANSFER } = require('../transactions/contants');
const {
  listTransactions, createTransaction, updateTransaction, deleteTransaction
} = require('../transactions/queries');

const transformDbRecordToTransfer = (dbTransfer) => ({
  id: Number(dbTransfer.id),
  account_id: Number(dbTransfer.account_id),
  description: dbTransfer.description,
  amount: Number(dbTransfer.amount),
  transfered_to: Number(dbTransfer.transfered_to),
  date: dbTransfer.date,
  created_at: dbTransfer.created_at,
  updated_at: dbTransfer.updated_at,
});

const isInvalidId = (id) => Number.isNaN(parseInt(id, 10));

/**
 * Lists all the transfers
 */
const listTransfers = async () => {
  const transfers = await listTransactions({ type: TRANSACTION_TYPE_TRANSFER }, ['date', 'desc']);

  return transfers.map(transformDbRecordToTransfer);
};

/**
 * Finds an transfers by its id
 *
 * @param {string|number} id
 * @throws A RecordNotFound error if the transfer does not exist.
 */
const findTransferById = async (id) => {
  if (isInvalidId(id)) {
    throw new RecordNotFound(`Transfer ID ${id} not found.`);
  }

  const transfers = await db.table('transactions').where({ id, type: TRANSACTION_TYPE_TRANSFER }).limit(1);

  if (transfers.length === 0) {
    throw new RecordNotFound(`Transfer ID ${id} not found.`);
  }

  return transformDbRecordToTransfer(transfers[0]);
};

/**
 * Persistes an transfers to the database
 *
 * @param {object} data
 */
const createTransfer = async (data) => {
  const newTransfer = await createTransaction({
    type: TRANSACTION_TYPE_TRANSFER,
    account_id: data.account_id,
    description: data.description,
    amount: data.amount,
    transfered_to: data.transfered_to,
    date: data.date,
  });

  return transformDbRecordToTransfer(newTransfer);
};

/**
 * Updates an transfer.
 *
 * @param {number} id
 * @param {object} data
 * @throws A RecordNotFound error if the transfer does not exist.
 */
const updateTransfer = async (id, data) => {
  try {
    const updatedTransfer = await updateTransaction(
      id,
      { ...data, type: TRANSACTION_TYPE_TRANSFER }
    );
    return transformDbRecordToTransfer(updatedTransfer);
  } catch (error) {
    if (error instanceof RecordNotFound) {
      throw new RecordNotFound(`Transfer ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

/**
 * Deletes an transfer
 *
 * @param {number} id
 * @throws A RecordNotFound error if the transfer does not exist.
 */
const deleteTransfer = async (id) => {
  try {
    await deleteTransaction(id, TRANSACTION_TYPE_TRANSFER);
  } catch (error) {
    if (error instanceof RecordNotFound) {
      throw new RecordNotFound(`Transfer ID ${id} not found.`);
    } else {
      throw error;
    }
  }
};

module.exports = {
  listTransfers,
  findTransferById,
  createTransfer,
  updateTransfer,
  deleteTransfer
};
