import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteIncome, getIncome, updateIncome } from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import DangerButton from "../components/DangerButton";
import IncomeForm from "../components/IncomeForm";
import NotFound from "./NotFound";

export default function IncomeEdit() {
  const params = useParams();
  const history = useHistory();
  const [success, setSuccess] = useState(null);
  const [income, setIncome] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getIncome(params.id)
      .then(setIncome)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  function handleSubmit(income) {
    window.scrollTo(0, 0);

    setLoading(true);
    setSuccess(null);
    setError(null);

    updateIncome(params.id, income)
      .then((data) => {
        setIncome(data);
        setSuccess("Income was modified!");
      })
      .catch((err) => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }

  function confirmDeletion() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete this transaction?")) {
      setLoading(true);
      setSuccess(null);
      setError(null);

      deleteIncome(income.id)
        .then(() => {
          setSuccess("Income deleted!");
          history.push("/")
        })
        .catch((err) => setError(err))
        .finally(() => {
          setLoading(false);
        });
    }
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

  if (isLoading) {
    return (
      <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
        <Alert type="info">Loading...</Alert>
      </div>
    );
  }

  if (!income) {
    return <NotFound>Transaction not found</NotFound>;
  }

  const alert = getAlert();

  return (
    <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
      {alert}

      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button>Go back</Button>
        </Link>

        <DangerButton onClick={() => confirmDeletion()}>Delete</DangerButton>
      </div>

      <IncomeForm
        title="Edit income"
        buttonText="Edit"
        original={income}
        errors={error ? error.errors : null}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
