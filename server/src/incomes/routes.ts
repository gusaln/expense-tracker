import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { parseDate } from '../utils/date';
import { createIncome, deleteIncome, findIncomeById, listIncomes, updateIncome } from './queries';
import IncomeNewSchema from './schemas/incomeNew.schema';
import IncomeUpdateSchema from './schemas/incomeUpdate.schema';

const incomeRoutes = Router();

// List incomes handler
incomeRoutes.get('/',
  async (_, res, next) => {
    try {
      const incomes = await listIncomes();

      res.json({
        data: incomes,
        total: incomes.length
      });
    } catch (error) {
      next(error);
    }
  });

// Get an income handler
incomeRoutes.get('/:income', async (req, res, next) => {
  try {
    const income = await findIncomeById(req.params.income);

    res.json({ data: income });
  } catch (error) {
    next(error);
  }
});

// Create incomes handler
incomeRoutes.post(
  '/',
  validate({ body: IncomeNewSchema }),
  async (req, res, next) => {
    try {
      const income = await createIncome({
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: parseDate(req.body.date).toDate(),
      });

      res.status(201).json({ data: income });
    } catch (error) {
      next(error);
    }
  }
);

// Edit income handler
incomeRoutes.put(
  '/:income',
  validate({ body: IncomeUpdateSchema }),
  async (req, res, next) => {
    try {
      const income = await updateIncome(req.params.income, {
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: parseDate(req.body.date).toDate(),
      });

      res.status(201).json({ data: income });
    } catch (error) {
      next(error);
    }
  }
);

// Delete income handler
incomeRoutes.delete(
  '/:income',
  async (req, res, next) => {
    try {
      await deleteIncome(req.params.income);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

export default incomeRoutes;
