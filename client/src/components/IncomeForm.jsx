import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import useCategories from "../hooks/useCategories";
import Card from "./Card";
import TextInput from "./TextInput";
import Select from "./Select";
import Button from "./Button";
import { parseDate } from "../utils";
import useAccounts from "../hooks/useAccounts";
import { FormProvider, useForm } from "react-hook-form";

function mapError(errors, name) {
  if (errors[name]) {
    return <span className="text-sm text-red-500">{errors[name]}</span>;
  }

  return "";
}

function IncomeForm(props) {
  const original = useMemo(() => {
    const now = parseDate(new Date());
    const _original = {
      account_id: "",
      category_id: "",
      description: "",
      amount: "",
      date: now.format("YYYY-MM-DD"),
      time: now.format("HH:mm"),
    };

    if (props.original) {
      Object.keys(_original)
        .filter((attr) => !["date", "time"].includes(attr))
        .forEach((attr) => {
          const value = props.original[attr];

          _original[attr] = value;
        });

      const datetime = parseDate(props.original.date);
      _original["date"] = datetime.format("YYYY-MM-DD");
      _original["time"] = datetime.format("HH:mm:ss");
    }

    return _original;
  }, [props.original]);

  const methods = useForm({ defaultValues: original });
  const {
    reset,
    handleSubmit,
    formState: { errors: formErrors },
  } = methods;

  const { accounts, isLoading: accountsLoading, getAccounts } = useAccounts();
  const {
    categories,
    isLoading: categoriesLoading,
    getCategories,
  } = useCategories();

  const errors = useMemo(
    () => (props.errors ? { ...formErrors, ...props.errors } : formErrors),
    [props.errors, formErrors]
  );

  useEffect(() => {
    getAccounts().then(console.log).catch(console.error);
    getCategories({ for_expenses: 0 }).then(console.log).catch(console.error);
  }, [getAccounts, getCategories]);

  function onSubmit(data) {
    if (props.onSubmit) {
      props.onSubmit({
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description,
        amount: data.amount,
        date: parseDate(data.date + " " + data.time),
      });
    }
  }

  return (
    <Card title={props.title}>
      <FormProvider {...methods}>
        <form
          className="space-y-4"
          action=""
          method="post"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            label="Description"
            name="description"
            required
            messages={mapError(errors, "description")}
          />
          <TextInput
            label="Amount"
            name="amount"
            required
            errors={errors.amount}
          />
          {accountsLoading ? (
            <div>Loading...</div>
          ) : (
            <Select
              label="Account"
              name="account_id"
              required
              options={accounts.map((a) => ({
                name: `${a.name} (${a.current_balance.amount} ${a.current_balance.currency})`,
                value: a.id,
              }))}
              messages={mapError(errors, "account_id")}
            />
          )}
          {categoriesLoading ? (
            <div>Loading...</div>
          ) : (
            <Select
              label="Category"
              name="category_id"
              required
              options={categories.map((c) => ({ name: c.name, value: c.id }))}
              messages={mapError(errors, "category_id")}
            />
          )}
          <TextInput
            label="Date"
            name="date"
            type="date"
            required
            messages={mapError(errors, "date")}
          />
          <TextInput label="Time" name="time" type="time" required />

          <div className="flex justify-end pt-4 space-x-4">
            <Button type="submit">{props.buttonText || "Create"}</Button>
            <Button text onClick={reset}>
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}

IncomeForm.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  errors: PropTypes.object,
};

export default IncomeForm;
