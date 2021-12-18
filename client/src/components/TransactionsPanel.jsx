import React, { useEffect, useMemo, useState } from "react";
import { DATE_FORMAT, getEndOfTheMonth, getStartOfTheMonth, groupBy, parseDate } from "../utils";
import useTransactions from "../hooks/useTransactions";
import Card from "./Card";
import TransactionGroupHeader from "./TransactionGroupHeader";
import TransactionsList from "./TransactionsList";
import Button from "./Button";

function TransactionsPanel() {
  const [monthOffset, setMonthOffset] = useState(0);
  const { transactions, isLoading, getTransactions } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const monthLabel = useMemo(
    () => parseDate(new Date()).add(monthOffset, "months").format("MMM-YYYY"),
    [monthOffset]
  );

  const transactionGroups = useMemo(
    () =>
      Object.entries(groupBy(filteredTransactions, (t) => parseDate(t.date).format("YYYY-MM-DD"))),
    [filteredTransactions]
  );

  useEffect(() => {
    const date = getStartOfTheMonth(new Date()).add(monthOffset, "months");

    getTransactions({
      after: date.format(DATE_FORMAT),
      before: getEndOfTheMonth(date).format(DATE_FORMAT),
    })
      .then(console.log)
      .catch(console.error);
  }, [getTransactions, monthOffset]);

  useEffect(() => {
    setFilteredTransactions([...transactions]);
  }, [transactions]);

  const panelContent = useMemo(() => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (transactions.length === 0) {
      return <div>There were no transactions this month.</div>;
    }

    return transactionGroups.map(([day, transactions]) => (
      <div key={day}>
        <TransactionGroupHeader day={day} />
        <TransactionsList transactions={transactions} />
      </div>
    ));
  }, [isLoading, transactionGroups, transactions]);

  return (
    <div>
      <Card
        title="Transactions"
        titleAddon={
          <>
            <Button small onClick={() => setMonthOffset((m) => m - 1)}>
              <span className="material-icons">arrow_left</span>
            </Button>
            <div className="flex items-center">{monthLabel}</div>
            <Button small onClick={() => setMonthOffset((m) => m + 1)}>
              <span className="material-icons">arrow_right</span>
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-gray-500">Click one to edit it</p>
        <div className="space-y-4">{panelContent}</div>
      </Card>
    </div>
  );
}

TransactionsPanel.propTypes = {};

export default TransactionsPanel;
