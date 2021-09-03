import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteCategory, getCategory, updateCategory } from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import DangerButton from "../components/DangerButton";
import CategoryEditForm from "../components/CategoryEditForm";
import NotFound from "./NotFound";

export default function CategoryEdit() {
  const params = useParams();
  const history = useHistory();
  const [success, setSuccess] = useState(null);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getCategory(params.id)
      .then(setCategory)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  function handleSubmit(category) {
    window.scrollTo(0, 0);

    setLoading(true);
    setSuccess(null);
    setError(null);

    updateCategory(params.id, category)
      .then((data) => {
        setCategory(data);
        setSuccess("Category was modified!");
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

      deleteCategory(category.id)
        .then(() => {
          setSuccess("Category deleted!");
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

  if (!category) {
    return <NotFound>Category not found</NotFound>;
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

      <CategoryEditForm
        title={`Edit category ${category.for_expenses ? 'for expenses' : 'for incomes'}`}
        buttonText="Edit"
        original={category}
        errors={error ? error.errors : null}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
