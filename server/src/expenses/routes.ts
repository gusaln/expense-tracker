import { Static } from "@sinclair/typebox";
import { Router } from "express";
import { Knex } from "knex";
import db from "../db";
import validate from "../middlewares/validate.middleware";
import computeRecurrentTransactionLastDate from "../recurrentTransactions/queries/computeRecurrentTransactionLastDate";
import createRecurrentTransactionDefinition from "../recurrentTransactions/queries/createRecurrentTransactionDefinition";
import findRecurrentTransactionDefinitionById from "../recurrentTransactions/queries/findRecurrentTransactionDefinitionById";
import parseRecurrentTransactionUpdateMode from "../recurrentTransactions/queries/parseRecurrentTransactionUpdateMode";
import updateRecurrentTransactionDefinition from "../recurrentTransactions/queries/updateRecurrentTransactionDefinition";
import recurrenceSchema from "../recurrentTransactions/schemas/recurrence.schema";
import { RecurrentTransactionUpdateMode } from "../recurrentTransactions/types";
import { parseDate } from "../utils/date";
import {
  createExpense,
  deleteExpense,
  findExpenseById,
  listExpenses,
  updateExpense,
  updateManyExpensesInSeries,
  updateManyExpensesInSeriesBefore
} from "./queries";
import ExpenseNewSchema from "./schemas/expenseNew.schema";
import ExpenseRecurrenceUpsertSchema from "./schemas/expenseRecurrenceUpsert.schema";
import ExpenseUpdateSchema from "./schemas/expenseUpdate.schema";
import { Expense } from "./types";

const expenseRoutes = Router();

const createRecurrenceFromRequest = async (
  expense: Expense,
  recurrence: Static<typeof recurrenceSchema>,
  connection?: Knex
) => {
  return await createRecurrentTransactionDefinition(
    {
      name: recurrence.name || expense.description,
      base_transaction_id: expense.id,
      last_transaction_date: expense.date,
      recur_freq: recurrence.recur_freq,
      recur_interval: Number(recurrence.recur_interval),
      recur_wkst: recurrence.recur_wkst,
      recur_bymonth: recurrence.recur_bymonth,
      recur_byweekno: recurrence.recur_byweekno,
      recur_byyearday: recurrence.recur_byyearday,
      recur_bymonthday: recurrence.recur_bymonthday,
      recur_byday: recurrence.recur_byday,
      recur_byhour: recurrence.recur_byhour,
      recur_byminute: recurrence.recur_byminute,
      recur_bysecond: recurrence.recur_bysecond,
      recur_bysetpos: recurrence.recur_bysetpos,
      recur_until: recurrence.recur_until ? parseDate(recurrence.recur_until).toDate() : undefined,
      recur_count: recurrence.recur_count ? Number(recurrence.recur_count) : undefined,
    },
    connection
  );
};

// List expenses handler
expenseRoutes.get("/", async (_, res, next) => {
  try {
    const expenses = await listExpenses();

    res.json({
      data: expenses,
      total: expenses.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get an expense handler
expenseRoutes.get("/:expense", async (req, res, next) => {
  try {
    const expense = await findExpenseById(req.params.expense);

    res.json({ data: expense });
  } catch (error) {
    next(error);
  }
});

// Create expenses handler
expenseRoutes.post("/", validate({ body: ExpenseNewSchema }), async (req, res, next) => {
  try {
    const expense = await db.transaction(async (trx) => {
      const expense = await createExpense(
        {
          account_id: req.body.account_id,
          category_id: req.body.category_id,
          description: req.body.description,
          amount: req.body.amount,
          date: parseDate(req.body.date).toDate(),
        },
        trx
      );

      if (req.body.recurrence) {
        const recurrence = await createRecurrenceFromRequest(expense, req.body.recurrence, trx);

        await updateExpense(expense.id, { ...expense, recurrence_id: recurrence.id }, trx);
      }

      return expense;
    });

    res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
});

// Edit expense handler
expenseRoutes.put("/:expense", validate({ body: ExpenseUpdateSchema }), async (req, res, next) => {
  try {
    const expense = await db.transaction(async (trx) => {
      const expense = await updateExpense(req.params.expense, {
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: parseDate(req.body.date).toDate(),
      });

      if (!expense.recurrence_id) {
        return expense;
      }

      const updateMode = parseRecurrentTransactionUpdateMode(
        req.body.series_update_mode || "single"
      );
      if (updateMode == RecurrentTransactionUpdateMode.ALL_IN_SERIES_BEFORE) {
        await updateManyExpensesInSeriesBefore(expense.recurrence_id, expense.date, expense, trx);
      } else if (updateMode == RecurrentTransactionUpdateMode.ALL_IN_SERIES) {
        await updateManyExpensesInSeries(expense.recurrence_id, req.body, trx);
      }

      const recurrence = await findRecurrentTransactionDefinitionById(expense.recurrence_id);
      await updateRecurrentTransactionDefinition(recurrence.id, {
        ...recurrence,
        last_transaction_date: (await computeRecurrentTransactionLastDate(recurrence)) as Date,
      });

      return expense;
    });

    res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
});

// Edit expense handler
expenseRoutes.put(
  "/:expense/recurrence",
  validate({ body: ExpenseRecurrenceUpsertSchema }),
  async (req, res, next) => {
    try {
      const expense = await findExpenseById(req.params.expense);

      let recurrence = null;
      if (!expense.recurrence_id) {
        recurrence = await createRecurrenceFromRequest(expense, req.body);
      } else {
        recurrence = await findRecurrentTransactionDefinitionById(expense.recurrence_id);

        recurrence = await updateRecurrentTransactionDefinition(expense.recurrence_id, {
          name: req.body.name || expense.description,
          base_transaction_id: expense.id,
          last_transaction_date: recurrence.last_transaction_date,
          recur_freq: req.body.recur_freq,
          recur_interval: Number(req.body.recur_interval),
          recur_wkst: req.body.recur_wkst,
          recur_bymonth: req.body.recur_bymonth,
          recur_byweekno: req.body.recur_byweekno,
          recur_byyearday: req.body.recur_byyearday,
          recur_bymonthday: req.body.recur_bymonthday,
          recur_byday: req.body.recur_byday,
          recur_byhour: req.body.recur_byhour,
          recur_byminute: req.body.recur_byminute,
          recur_bysecond: req.body.recur_bysecond,
          recur_bysetpos: req.body.recur_bysetpos,
          recur_until: req.body.recur_until ? parseDate(req.body.recur_until).toDate() : undefined,
          recur_count: req.body.recur_count ? Number(req.body.recur_count) : undefined,
        });
      }

      res.status(201).json({ data: recurrence });
    } catch (error) {
      next(error);
    }
  }
);

// Delete expense handler
expenseRoutes.delete("/:expense", async (req, res, next) => {
  try {
    const expense = await findExpenseById(req.params.expense);

    if (expense.recurrence_id) {
      await db.transaction(async (trx) => {
        await deleteExpense(req.params.expense, trx);

        const recurrence = await findRecurrentTransactionDefinitionById(expense.recurrence_id as number);
        await updateRecurrentTransactionDefinition(
          recurrence.id,
          {
            ...recurrence,
            last_transaction_date: (await computeRecurrentTransactionLastDate(recurrence)) as Date,
          },
          trx
        );
      });
    } else {
      await deleteExpense(req.params.expense);
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default expenseRoutes;
