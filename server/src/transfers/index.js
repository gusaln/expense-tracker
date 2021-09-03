const { Router } = require('express');
const { Joi } = require('express-validation');
const { validate } = require('../middlewares');
const { validator } = require('../validation');
const {
  listTransfers, createTransfer, findTransferById, updateTransfer, deleteTransfer
} = require('./queries');

const router = Router();

const transferSchema = {
  body: validator.object({
    account_id: validator.number().min(1).integer().required(),
    description: validator.string().max(255).required(),
    amount: validator.number().min(1).max(999999.99).required(),
    transfered_to: validator.number().min(1).integer().invalid(Joi.ref('account_id'))
      .required(),
    date: validator.date().required(),
  }),
};

// List transfers handler
router.get('/', async (_, res, next) => {
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
router.get('/:transfer', async (req, res, next) => {
  try {
    const transfer = await findTransferById(req.params.transfer);

    res.json({ data: transfer });
  } catch (error) {
    next(error);
  }
});

// Create transfers handler
router.post('/', validate(transferSchema), async (req, res, next) => {
  try {
    const transfer = await createTransfer({
      account_id: req.body.account_id,
      description: req.body.description,
      amount: req.body.amount,
      transfered_to: req.body.transfered_to,
      date: req.body.date,
    });

    res.status(201).json({ data: transfer });
  } catch (error) {
    next(error);
  }
});

// Edit transfer handler
router.put('/:transfer', validate(transferSchema), async (req, res, next) => {
  try {
    const transfer = await updateTransfer(req.params.transfer, {
      account_id: req.body.account_id,
      description: req.body.description,
      amount: req.body.amount,
      transfered_to: req.body.transfered_to,
      date: req.body.date,
    });

    res.status(201).json({ data: transfer });
  } catch (error) {
    next(error);
  }
});

// Delete transfer handler
router.delete('/:transfer', async (req, res, next) => {
  try {
    await deleteTransfer(req.params.transfer);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
