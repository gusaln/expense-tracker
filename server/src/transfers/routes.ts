import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { parseDate } from '../utils/date';
import { createTransfer, deleteTransfer, findTransferById, listTransfers, updateTransfer } from './queries';
import TransferNewSchema from './schemas/transferNew.schema';
import TransferUpdateSchema from './schemas/transferUpdate.schema';

const transferRoutes = Router();

// List transfers handler
transferRoutes.get('/', async (_, res, next) => {
  try {
    const transfers = await listTransfers();

    res.json({
      data: transfers,
      total: transfers.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get an transfer handler
transferRoutes.get('/:transfer', async (req, res, next) => {
  try {
    const transfer = await findTransferById(req.params.transfer);

    res.json({ data: transfer });
  } catch (error) {
    next(error);
  }
});

// Create transfers handler
transferRoutes.post('/',
  validate({ body: TransferNewSchema }),
  async (req, res, next) => {
    try {
      const transfer = await createTransfer({
        account_id: req.body.account_id,
        description: req.body.description,
        amount: req.body.amount,
        transferred_to: req.body.transferred_to,
        date: parseDate(req.body.date).toDate(),
      });

      res.status(201).json({ data: transfer });
    } catch (error) {
      next(error);
    }
  });

// Edit transfer handler
transferRoutes.put('/:transfer',
  validate({ body: TransferUpdateSchema }),
  async (req, res, next) => {
    try {
      const transfer = await updateTransfer(req.params.transfer, {
        account_id: req.body.account_id,
        description: req.body.description,
        amount: req.body.amount,
        transferred_to: req.body.transferred_to,
        date: parseDate(req.body.date).toDate(),
      });

      res.status(201).json({ data: transfer });
    } catch (error) {
      next(error);
    }
  });

// Delete transfer handler
transferRoutes.delete('/:transfer', async (req, res, next) => {
  try {
    await deleteTransfer(req.params.transfer);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default transferRoutes;
