import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { parseDate } from '../utils/date';
import { createExpense, deleteExpense, findExpenseById, listExpenses, updateExpense } from './queries';
import ExpenseNewSchema from './schemas/expenseNew.schema';
import ExpenseUpdateSchema from './schemas/expenseUpdate.schema';

const expenseRoutes = Router();

// List expenses handler
expenseRoutes.get('/',
  async (_, res, next) => {
    try {
      const expenses = await listExpenses();

      res.json({
        data: expenses,
        total: expenses.length
      });
    } catch (error) {
      next(error);
    }
  });

// Get an expense handler
expenseRoutes.get('/:expense', async (req, res, next) => {
  try {
    const expense = await findExpenseById(req.params.expense);

    res.json({ data: expense });
  } catch (error) {
    next(error);
  }
});

// Create expenses handler
expenseRoutes.post(
  '/',
  validate({ body: ExpenseNewSchema }),
  async (req, res, next) => {
    try {
      const expense = await createExpense({
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: parseDate(req.body.date).toDate(),
      });

      res.status(201).json({ data: expense });
    } catch (error) {
      next(error);
    }
  }
);

// Edit expense handler
expenseRoutes.put(
  '/:expense',
  validate({ body: ExpenseUpdateSchema }),
  async (req, res, next) => {
    try {
      const expense = await updateExpense(req.params.expense, {
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: parseDate(req.body.date).toDate(),
      });

      res.status(201).json({ data: expense });
    } catch (error) {
      next(error);
    }
  }
);

// Delete expense handler
expenseRoutes.delete(
  '/:expense',
  async (req, res, next) => {
    try {
      await deleteExpense(req.params.expense);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

export default expenseRoutes;
