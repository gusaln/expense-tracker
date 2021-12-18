import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { addExpense, addIncome, addTransfer } from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import IncomeForm from "../components/IncomeForm";
import ExpenseForm from "../components/ExpenseForm";
import TransferForm from "../components/TransferForm";

const actionMap = {
  income: addIncome,
  expense: addExpense,
  transfer: addTransfer,
};

export default function TransactionCreate() {
  const location = useLocation();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState(
    () => new URLSearchParams(location.search).get("type") || "income"
  );

  function handleSubmit(data) {
    window.scrollTo(0, 0);

    setError(null);

    actionMap[type](data)
      .then(() => setSuccess("Transaction was created!"))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  function getAlert() {
    if (error) {
      return (
        <Alert type="error" onClose={() => setError(null)} closable>
          {error.message || "There was an error proccessing the request."}
        </Alert>
      );
    }

    if (success) {
      return (
        <Alert type="success" onClose={() => setSuccess(null)} closable>
          {success}
        </Alert>
      );
    }

    return "";
  }

  function getForm() {
    switch (type) {
      case "income":
        return <IncomeForm title="Add an income" onSubmit={handleSubmit} errors={error} />;

      case "expense":
        return <ExpenseForm title="Add an expense" onSubmit={handleSubmit} errors={error} />;

      case "transfer":
      default:
        return <TransferForm title="Add a transfer" onSubmit={handleSubmit} errors={error} />;
    }
  }

  if (isLoading) {
    return (
      <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
        <Alert type="info">Proccessing...</Alert>
      </div>
    );
  }

  const alert = getAlert();
  const form = getForm();

  return (
    <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
      {alert}

      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button>Go back</Button>
        </Link>

        <div className="flex space-x-4">
          <Button disabled={type === "income"} onClick={() => setType("income")}>
            Add income
          </Button>
          <Button disabled={type === "expense"} onClick={() => setType("expense")}>
            Add expense
          </Button>
          <Button disabled={type === "transfer"} onClick={() => setType("transfer")}>
            Transfer money
          </Button>
        </div>
      </div>

      {form}
    </div>
  );
}
