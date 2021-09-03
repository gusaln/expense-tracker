const { Router } = require('express');
const { keyBy, unique } = require('../utils/arrays');
const { parseDate } = require('../utils/date');
const { listTransactions, findTransactionById } = require('./queries');
const { findMultipleAccountsById } = require('../accounts/queries');
const { findMultipleCategoriesById } = require('../categories/queries');

const router = Router();

// List transactions handler
router.get('/', async (req, res, next) => {
  try {
    const sortBy = req.query.sort;
    const transactions = await listTransactions(
      {
        type: req.query.type,
        account_id: req.query.account_id,
        category_id: req.query.category_id,
        before: req.query.before ? parseDate(req.query.before) : undefined,
        after: req.query.after ? parseDate(req.query.after) : undefined,
      },
      sortBy
    );

    const accounts = keyBy(
      await findMultipleAccountsById(
        unique(
          transactions
            .map((t) => t.account_id)
            .concat(transactions.map((t) => t.transfered_to))
            .filter((id) => id)
        )
      ),
      'id'
    );

    const categories = keyBy(
      await findMultipleCategoriesById(
        unique(transactions.map((t) => t.category_id).filter((id) => id))
      ),
      'id'
    );

    res.json({
      data: transactions.map((t) => ({
        ...t,
        account: accounts[t.account_id],
        category: categories[t.category_id],
        transfered_to_account: accounts[t.transfered_to],
      })),
      total: transactions.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get an transaction handler
router.get('/:transaction', async (req, res, next) => {
  try {
    const transaction = await findTransactionById(req.params.transaction);

    res.json({ data: transaction });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
