const { Router } = require('express');
const { parseDate } = require('../utils/date');
const { getIncomeReport, getExpenseReport, getBalancesByCurrency } = require('./queries');

const router = Router();

router.get('/transactions', async (req, res, next) => {
  try {
    const after = parseDate(req.query.after);
    const before = parseDate(req.query.before);

    const incomesByCurrency = await getIncomeReport(
      after,
      before,
      req.query.account_id
    );

    const expensesByCurrency = await getExpenseReport(
      after,
      before,
      req.query.account_id
    );

    res.json({
      data: {
        incomes: incomesByCurrency,
        expenses: expensesByCurrency,
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/balance_by_currency', async (_, res, next) => {
  try {
    const balances = await getBalancesByCurrency();

    res.json({
      data: { balances }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
