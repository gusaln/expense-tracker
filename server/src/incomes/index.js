const { Router } = require('express');
const { validate } = require('../middlewares');
const { validator } = require('../validation');
const {
  listIncomes, createIncome, findIncomeById, updateIncome, deleteIncome
} = require('./queries');

const router = Router();

const incomeSchema = {
  body: validator.object({
    account_id: validator.number().min(1).integer().required(),
    category_id: validator.number().min(1).integer().required(),
    description: validator.string().max(255).required(),
    amount: validator.number().min(1).max(999999.99).required(),
    date: validator.date().required(),
  })
};

// List incomes handler
router.get('/', async (_, res, next) => {
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
router.get('/:income', async (req, res, next) => {
  try {
    const income = await findIncomeById(req.params.income);

    res.json({ data: income });
  } catch (error) {
    next(error);
  }
});

// Create incomes handler
router.post(
  '/',
  validate(incomeSchema),
  async (req, res, next) => {
    try {
      const income = await createIncome({
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
      });

      res.status(201).json({ data: income });
    } catch (error) {
      next(error);
    }
  }
);

// Edit income handler
router.put(
  '/:income',
  validate(incomeSchema),
  async (req, res, next) => {
    try {
      const income = await updateIncome(req.params.income, {
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
      });

      res.status(201).json({ data: income });
    } catch (error) {
      next(error);
    }
  }
);

// Delete income handler
router.delete(
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

module.exports = router;
