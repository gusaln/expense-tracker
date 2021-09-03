const { Router } = require('express');
const { validate } = require('../middlewares');
const { validator } = require('../validation');
const {
  listAccounts, createAccount, findAccountById, updateAccount, deleteAccount
} = require('./queries');

const router = Router();

const accountStoreSchema = {
  body: validator.object({
    name: validator.string().max(255).required(),
    icon: validator.string().max(50).required(),
    color: validator.color().required(),
    currency: validator.string().length(3).required()
  })
};

const accountUpdateSchema = {
  body: validator.object({
    name: validator.string().max(255).required(),
    icon: validator.string().max(50).required(),
    color: validator.color().required(),
  })
};

// List accounts handler
router.get('/', async (_, res, next) => {
  try {
    const accounts = await listAccounts();

    res.json({
      data: accounts,
      total: accounts.length
    });
  } catch (error) {
    next(error);
  }
});

// Get an account handler
router.get('/:account', async (req, res, next) => {
  try {
    const account = await findAccountById(req.params.account);

    res.json({ data: account });
  } catch (error) {
    next(error);
  }
});

// Create accounts handler
router.post(
  '/',
  validate(accountStoreSchema),
  async (req, res, next) => {
    try {
      const account = await createAccount({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        currency: req.body.currency
      });

      res.status(201).json({ data: account });
    } catch (error) {
      next(error);
    }
  }
);

// Edit account handler
router.put(
  '/:account',
  validate(accountUpdateSchema),
  async (req, res, next) => {
    try {
      const account = await updateAccount(req.params.account, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      });

      res.status(201).json({ data: account });
    } catch (error) {
      next(error);
    }
  }
);

// Delete account handler
router.delete(
  '/:account',
  async (req, res, next) => {
    try {
      await deleteAccount(req.params.account);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
