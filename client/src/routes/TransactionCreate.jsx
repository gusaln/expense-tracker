import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { addExpense, addIncome, addTransfer } from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Card from "../components/Card";
import ExpenseForm from "../components/ExpenseForm";
import IncomeForm from "../components/IncomeForm";
import Modal from "../components/Modal";
import RecurrenceNewForm from "../components/RecurrenceNewForm";
import TransferForm from "../components/TransferForm";
import useModal from "../hooks/useModal";
import { getRecurrenceText } from "../utils";

const actionMap = {
  income: addIncome,
  expense: addExpense,
  transfer: addTransfer,
};

function PageAlert({ success, error, setSuccess, setError }) {
  if (error) {
    return (
      <Alert type="error" onClose={() => setError(null)} closable>
        {error.message || "There was an error processing the request."}
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

function TransactionForm({ type, error, onSubmit }) {
  if (type === "income")
    return <IncomeForm title="Add an income" onSubmit={onSubmit} errors={error} />;

  if (type === "expense")
    return <ExpenseForm title="Add an expense" onSubmit={onSubmit} errors={error} />;

  return <TransferForm title="Add a transfer" onSubmit={onSubmit} errors={error} />;
}

export default function TransactionCreate() {
  const location = useLocation();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState(
    () => new URLSearchParams(location.search).get("type") || "income"
  );

  const recurrenceFormModal = useModal();
  const [recurrence, setRecurrence] = useState(null);
  const recurrenceString = useMemo(() => getRecurrenceText(recurrence) || "", [recurrence]);

  function handleSubmit(data) {
    console.log("TransactionCreate.handleSubmit", { data });

    window.scrollTo(0, 0);

    setError(null);

    actionMap[type]({ ...data, recurrence: recurrence || undefined })
      .then(() => setSuccess("Transaction was created!"))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  function handleRecurrenceSubmit(recurrence) {
    console.log("TransactionCreate.handleRecurrenceSubmit", { recurrence });

    window.scrollTo(0, 0);

    setRecurrence(recurrence);
    recurrenceFormModal.close();
  }

  function handleClearRecurrence() {
    setRecurrence(null);
  }

  if (isLoading) {
    return (
      <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
        <Alert type="info">processing...</Alert>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
      <PageAlert success={success} error={error} setSuccess={setSuccess} setError={setError} />

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

      <Modal isOpen={recurrenceFormModal.isOpen} onClose={recurrenceFormModal.close}>
        <div className="w-[90%] max-h-[90%] lg:w-1/2">
          <RecurrenceNewForm
            original={recurrence}
            onSubmit={handleRecurrenceSubmit}
            onCancel={recurrenceFormModal.close}
          />
        </div>
      </Modal>

      {type !== "transfer" && (
        <div className="mb-4">
          <Card>
            <div className="flex justify-between">
              {recurrence ? `Repeats ${recurrenceString}.` : "It does not repeat."}
              {recurrence ? (
                <div className="grow-0 flex justify-end items-center space-x-2">
                  <Button small onClick={handleClearRecurrence}>
                    Do not repeat
                  </Button>
                  <Button small onClick={recurrenceFormModal.open}>
                    Change Recurrence
                  </Button>
                </div>
              ) : (
                <Button small onClick={recurrenceFormModal.open}>
                  Repeat
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      <TransactionForm type={type} error={error} onSubmit={handleSubmit} />
    </div>
  );
}
