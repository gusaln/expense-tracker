import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  deleteExpense,
  getExpense,
  getRecurrence,
  updateExpense,
  upsertExpenseRecurrence
} from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Card from "../components/Card";
import DangerButton from "../components/DangerButton";
import ExpenseForm from "../components/ExpenseForm";
import LoadingWhile from "../components/LoadingWhile";
import Modal from "../components/Modal";
import RecurrenceNewForm from "../components/RecurrenceNewForm";
import RecurrenceUpdateForm from "../components/RecurrenceUpdateForm";
import useModal from "../hooks/useModal";
import { getRecurrenceText } from "../utils";
import NotFound from "./NotFound";

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

export default function ExpenseEdit() {
  const params = useParams();
  const history = useHistory();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [expense, setExpense] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const [recurrence, setRecurrence] = useState(null);
  const [isRecurrenceLoading, setRecurrenceLoading] = useState(false);

  const recurrenceFormModal = useModal();
  const [recurrenceString, setRecurrenceString] = useState("");

  function getExpenseRecurrence(expense) {
    if (!expense.recurrence_id) return;

    setRecurrenceLoading(true);

    getRecurrence(expense.recurrence_id)
      .then((data) => {
        setRecurrence(data);
        setRecurrenceString(getRecurrenceText(data) || "");
      })
      .catch(console.error)
      .finally(() => {
        setRecurrenceLoading(false);
      });
  }

  function handleExpenseSubmit(expense) {
    window.scrollTo(0, 0);

    setLoading(true);
    setSuccess(null);
    setError(null);

    const form = document.getElementById("updateTypeForm");
    if (form) {
      const data = new FormData(form);

      expense = { ...expense, series_update_mode: data.get("series_update_mode") };
    }

    updateExpense(params.id, expense)
      .then((data) => {
        setExpense(data);
        setSuccess("Expense was modified!");
      })
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }

  function handleRecurrenceUpsertSubmit(recurrence) {
    window.scrollTo(0, 0);

    recurrenceFormModal.close();

    setLoading(true);
    setSuccess(null);
    setError(null);

    upsertExpenseRecurrence(params.id, recurrence)
      .then((data) => {
        setRecurrence(data);
        setSuccess("Recurrence was modified!");
      })
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDeleteExpense() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    deleteExpense(expense.id)
      .then(() => {
        setSuccess("Expense deleted!");
        history.push("/");
      })
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteRecurrence() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to stop repeating this transaction?")) return;
  }

  useEffect(() => {
    setLoading(true);

    getExpense(params.id)
      .then((expense) => {
        setExpense(expense);

        getExpenseRecurrence(expense);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="md:my-8">
        <Alert type="info">Loading...</Alert>
      </div>
    );
  }

  if (!expense) {
    return <NotFound>Transaction not found</NotFound>;
  }

  return (
    <div className="space-y-6 md:my-8">
      <PageAlert success={success} error={error} setSuccess={setSuccess} setError={setError} />

      <div className="flex justify-between">
        <Link to="/">
          <Button>Go back</Button>
        </Link>

        <DangerButton onClick={() => handleDeleteExpense()}>Delete</DangerButton>
      </div>

      <Modal isOpen={recurrenceFormModal.isOpen} onClose={recurrenceFormModal.close}>
        <div className="w-[90%] max-h-[90%] lg:w-1/2">
          {recurrence ? (
            <RecurrenceUpdateForm
              original={recurrence}
              onSubmit={handleRecurrenceUpsertSubmit}
              onCancel={recurrenceFormModal.close}
            />
          ) : (
            <RecurrenceNewForm
              onSubmit={handleRecurrenceUpsertSubmit}
              onCancel={recurrenceFormModal.close}
            />
          )}
        </div>
      </Modal>

      <div className="lg:flex lg:justify-between lg:space-x-4">
        <div className="lg:w-8/12">
          <ExpenseForm
            title="Edit expense"
            buttonText="Edit"
            original={expense}
            errors={error ? error.errors : null}
            onSubmit={handleExpenseSubmit}
          />
        </div>

        <div className="space-y-4 lg:w-4/12">
          <Card>
            <LoadingWhile isLoading={isRecurrenceLoading}>
              <div className="mb-4">
                {recurrence ? `Repeats ${recurrenceString}` : "It does not repeat"}.
              </div>

              <div className="flex justify-end space-x-2">
                {recurrence ? (
                  <>
                    <Button small onClick={() => deleteRecurrence()}>
                      Do not repeat
                    </Button>
                    <Button small onClick={recurrenceFormModal.open}>
                      Change Recurrence
                    </Button>
                  </>
                ) : (
                  <Button small onClick={recurrenceFormModal.open}>
                    Repeat
                  </Button>
                )}
              </div>
            </LoadingWhile>
          </Card>

          {recurrence && (
            <Card title="Do you want to...">
              <form id="updateTypeForm">
                <label
                  className="block -mx-2 rounded-md p-2 transition-all duration-200 hover:bg-paper-dark"
                  htmlFor="series_update_mode.single"
                >
                  <input
                    className="mr-2"
                    type="radio"
                    name="series_update_mode"
                    id="series_update_mode.single"
                    value="single"
                    checked
                  />
                  only modify this entry?
                </label>

                <label
                  className="block -mx-2 rounded-md p-2 transition-all duration-200 hover:bg-paper-dark"
                  htmlFor="series_update_mode.all_in_series"
                >
                  <input
                    className="mr-2"
                    type="radio"
                    name="series_update_mode"
                    id="series_update_mode.all_in_series"
                    value="all_in_series"
                  />
                  modify all transactions in series?
                </label>

                <label
                  className="block -mx-2 rounded-md p-2 transition-all duration-200 hover:bg-paper-dark"
                  htmlFor="series_update_mode.all_in_series_before"
                >
                  <input
                    className="mr-2"
                    type="radio"
                    name="series_update_mode"
                    id="series_update_mode.all_in_series_before"
                    value="all_in_series_before"
                  />
                  modify this and all transactions before this one?
                </label>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
