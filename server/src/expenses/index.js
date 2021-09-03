const { Router } = require('express');
const { validate } = require('../middlewares');
const { validator } = require('../validation');
const {
  listExpenses, createExpense, findExpenseById, updateExpense, deleteExpense
} = require('./queries');

const router = Router();

const expenseSchema = {
  body: validator.object({
    account_id: validator.number().min(1).integer().required(),
    category_id: validator.number().min(1).integer().required(),
    description: validator.string().max(255).required(),
    amount: validator.number().min(1).max(999999.99).required(),
    date: validator.date().required(),
  })
};

// List expenses handler
router.get('/', async (_, res, next) => {
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
router.get('/:expense', async (req, res, next) => {
  try {
    const expense = await findExpenseById(req.params.expense);

    res.json({ data: expense });
  } catch (error) {
    next(error);
  }
});

// Create expenses handler
router.post(
  '/',
  validate(expenseSchema),
  async (req, res, next) => {
    try {
      const expense = await createExpense({
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
      });

      res.status(201).json({ data: expense });
    } catch (error) {
      next(error);
    }
  }
);

// Edit expense handler
router.put(
  '/:expense',
  validate(expenseSchema),
  async (req, res, next) => {
    try {
      const expense = await updateExpense(req.params.expense, {
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
      });

      res.status(201).json({ data: expense });
    } catch (error) {
      next(error);
    }
  }
);

// Delete expense handler
router.delete(
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

module.exports = router;
