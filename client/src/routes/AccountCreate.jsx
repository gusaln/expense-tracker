import React, { useState } from "react";
import { Link } from "react-router-dom";
import { addAccount } from "../api";
import AccountForm from "../components/AccountForm";
import Alert from "../components/Alert";
import Button from "../components/Button";

export default function AccountCreate() {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  function handleSubmit(data) {
    window.scrollTo(0, 0);

    setError(null);

    addAccount(data)
      .then(() => setSuccess("Account was created!"))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  function getAlert() {
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

  if (isLoading) {
    return (
      <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
        <Alert type="info">processing...</Alert>
      </div>
    );
  }

  const alert = getAlert();

  return (
    <div className="w-11/12 mx-auto md:w-10/12 md:my-8 lg:w-8/12">
      {alert}

      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button>Go back</Button>
        </Link>
      </div>

      <AccountForm
        title="Add a account"
        onSubmit={handleSubmit}
        errors={error ? error.errors : null}
      />
    </div>
  );
}
