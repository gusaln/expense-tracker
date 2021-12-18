import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteAccount, getAccount, updateAccount } from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import DangerButton from "../components/DangerButton";
import AccountEditForm from "../components/AccountEditForm";
import NotFound from "./NotFound";

export default function AccountEdit() {
  const params = useParams();
  const history = useHistory();
  const [success, setSuccess] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getAccount(params.id)
      .then(setAccount)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  function handleSubmit(account) {
    window.scrollTo(0, 0);

    setLoading(true);
    setSuccess(null);
    setError(null);

    updateAccount(params.id, account)
      .then((data) => {
        setAccount(data);
        setSuccess("Account was modified!");
      })
      .catch((err) => setError(err.errors))
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

      deleteAccount(account.id)
        .then(() => {
          setSuccess("Account deleted!");
          history.push("/");
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

  if (!account) {
    return <NotFound>Account not found</NotFound>;
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

      <AccountEditForm
        title={"Edit account"}
        buttonText="Edit"
        original={account}
        errors={error ? error.errors : null}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
