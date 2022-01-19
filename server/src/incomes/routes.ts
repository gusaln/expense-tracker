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
  createIncome,
  deleteIncome,
  findIncomeById,
  listIncomes,
  updateIncome,
  updateManyIncomesInSeries,
  updateManyIncomesInSeriesBefore
} from "./queries";
import IncomeNewSchema from "./schemas/incomeNew.schema";
import IncomeRecurrenceUpsertSchema from "./schemas/incomeRecurrenceUpsert.schema";
import IncomeUpdateSchema from "./schemas/incomeUpdate.schema";
import { Income } from "./types";

const incomeRoutes = Router();

const createRecurrenceFromRequest = async (
  income: Income,
  recurrence: Static<typeof recurrenceSchema>,
  connection?: Knex
) => {
  return await createRecurrentTransactionDefinition(
    {
      name: recurrence.name || income.description,
      base_transaction_id: income.id,
      last_transaction_date: income.date,
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

// List incomes handler
incomeRoutes.get("/", async (_, res, next) => {
  try {
    const incomes = await listIncomes();

    res.json({
      data: incomes,
      total: incomes.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get an income handler
incomeRoutes.get("/:income", async (req, res, next) => {
  try {
    const income = await findIncomeById(req.params.income);

    res.json({ data: income });
  } catch (error) {
    next(error);
  }
});

// Create incomes handler
incomeRoutes.post("/", validate({ body: IncomeNewSchema }), async (req, res, next) => {
  try {
    const income = await db.transaction(async (trx) => {
      const income = await createIncome(
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
        const recurrence = await createRecurrenceFromRequest(income, req.body.recurrence, trx);

        await updateIncome(income.id, { ...income, recurrence_id: recurrence.id }, trx);
      }

      return income;
    });

    res.status(201).json({ data: income });
  } catch (error) {
    next(error);
  }
});

// Edit income handler
incomeRoutes.put("/:income", validate({ body: IncomeUpdateSchema }), async (req, res, next) => {
  try {
    const income = await db.transaction(async (trx) => {
      const income = await updateIncome(req.params.income, {
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        description: req.body.description,
        amount: req.body.amount,
        date: parseDate(req.body.date).toDate(),
      });

      if (!income.recurrence_id) {
        return income;
      }

      const updateMode = parseRecurrentTransactionUpdateMode(
        req.body.series_update_mode || "single"
      );
      if (updateMode == RecurrentTransactionUpdateMode.ALL_IN_SERIES_BEFORE) {
        await updateManyIncomesInSeriesBefore(income.recurrence_id, income.date, income, trx);
      } else if (updateMode == RecurrentTransactionUpdateMode.ALL_IN_SERIES) {
        await updateManyIncomesInSeries(income.recurrence_id, req.body, trx);
      }

      const recurrence = await findRecurrentTransactionDefinitionById(income.recurrence_id);
      await updateRecurrentTransactionDefinition(recurrence.id, {
        ...recurrence,
        last_transaction_date: (await computeRecurrentTransactionLastDate(recurrence)) as Date,
      });

      return income;
    });

    res.status(201).json({ data: income });
  } catch (error) {
    next(error);
  }
});

// Edit income handler
incomeRoutes.put(
  "/:income/recurrence",
  validate({ body: IncomeRecurrenceUpsertSchema }),
  async (req, res, next) => {
    try {
      const income = await findIncomeById(req.params.income);

      let recurrence = null;
      if (!income.recurrence_id) {
        recurrence = await createRecurrenceFromRequest(income, req.body);
      } else {
        recurrence = await findRecurrentTransactionDefinitionById(income.recurrence_id);

        recurrence = await updateRecurrentTransactionDefinition(income.recurrence_id, {
          name: req.body.name || income.description,
          base_transaction_id: income.id,
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

// Delete income handler
incomeRoutes.delete("/:income", async (req, res, next) => {
  try {
    const income = await findIncomeById(req.params.income);

    if (income.recurrence_id) {
      await db.transaction(async (trx) => {
        await deleteIncome(req.params.income, trx);

        const recurrence = await findRecurrentTransactionDefinitionById(income.recurrence_id as number);
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
      await deleteIncome(req.params.income);
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default incomeRoutes;
