import { Type } from '@sinclair/typebox';
import { NextFunction, Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { IntegerType } from '../types';
import { createAccount, deleteAccount, findAccountById, listAccounts, updateAccount } from './queries';
import AccountNewSchema from './schemas/accountNew.schema';
import AccountUpdateSchema from './schemas/accountUpdate.schema';

const ParamsSchema = Type.Object({ account: IntegerType });

const accountRoutes = Router();

// List accounts handler
accountRoutes.get('/', async (_, res, next) => {
  try {
    const accounts = await listAccounts();

    res.json({
      data: accounts,
      total: accounts.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get an account handler
accountRoutes.get('/:account', async (req, res, next) => {
  try {
    const account = await findAccountById(req.params.account);

    res.json({ data: account });
  } catch (error) {
    next(error);
  }
});

// Create accounts handler
accountRoutes.post(
  '/',
  validate({ body: AccountNewSchema }),
  async (req, res, next: NextFunction) => {
    try {
      const account = await createAccount({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        currency: req.body.currency,
      });

      res.status(201).json({ data: account });
    } catch (error) {
      next(error);
    }
  }
);

// Edit account handler
accountRoutes.put(
  '/:account',
  validate({ params: ParamsSchema, body: AccountUpdateSchema }),
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
accountRoutes.delete(
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

export default accountRoutes;
