import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import AccountsPanel from "../components/AccountsPanel";
import CategoriesPanel from "../components/CategoriesPanel";
import TransactionsPanel from "../components/TransactionsPanel";
import { fetchBalancesByCurrency, fetchMonthlyReport } from "../api";
import { formatNumber } from "../utils";

function formatValueByCurrency(valueByCurrency) {
  const entries = Object.entries(valueByCurrency);

  if (entries.length === 0) return [`${formatNumber(0)} USD`];

  return entries.map(
    ([currency, value]) => `${formatNumber(value)} ${currency}`
  );
}

export default function Home() {
  const [balancesByCurrency, setBalancesByCurrency] = useState({});
  const [incomesByCurrency, setIncomesByCurrency] = useState({});
  const [expensesByCurrency, setExpensesByCurrency] = useState({});

  useEffect(() => {
    fetchBalancesByCurrency()
      .then(({ balances }) => setBalancesByCurrency(balances))
      .catch(console.error);
    fetchMonthlyReport()
      .then(({ incomes, expenses }) => {
        setIncomesByCurrency(incomes);
        setExpensesByCurrency(expenses);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div key="summary" className="mb-6 grid grid-cols-3 gap-4">
        <Card title="Total balance">
          {formatValueByCurrency(balancesByCurrency).map((text) => (
            <div className="text-4xl">{text}</div>
          ))}
        </Card>
        <Card title="Incomes this month">
          {formatValueByCurrency(incomesByCurrency).map((text) => (
            <div className="text-4xl text-blue-500">{text}</div>
          ))}
        </Card>
        <Card title="Expenses this month">
          {formatValueByCurrency(expensesByCurrency).map((text) => (
            <div className="text-4xl text-red-500">{text}</div>
          ))}
        </Card>
      </div>

      <div key="dashboard" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <AccountsPanel />
          <CategoriesPanel />
        </div>

        <TransactionsPanel />
      </div>
    </>
  );
}
