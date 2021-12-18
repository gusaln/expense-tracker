import { Router } from "express";
import { parseDate } from "../utils/date";
import { getBalancesByCurrency, getExpenseReport, getIncomeReport } from "./queries";

const summaryRoutes = Router();

summaryRoutes.get("/transactions", async (req, res, next) => {
  try {
    const after = parseDate(req.query.after as string).toDate();
    const before = parseDate(req.query.before as string).toDate();

    const incomesByCurrency = await getIncomeReport(
      after,
      before,
      req.query.account_id as string | undefined
    );

    const expensesByCurrency = await getExpenseReport(
      after,
      before,
      req.query.account_id as string | undefined
    );

    res.json({
      data: {
        incomes: incomesByCurrency,
        expenses: expensesByCurrency,
      },
    });
  } catch (error) {
    next(error);
  }
});

summaryRoutes.get("/balance_by_currency", async (_, res, next) => {
  try {
    const balances = await getBalancesByCurrency();

    res.json({
      data: { balances },
    });
  } catch (error) {
    next(error);
  }
});

export default summaryRoutes;
