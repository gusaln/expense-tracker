import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useAccounts from "../hooks/useAccounts";
import { parseDate } from "../utils";
import Button from "./Button";
import Card from "./Card";
import Select from "./Select";
import TextInput from "./TextInput";

function mapError(errors, name) {
  if (errors[name]) {
    return <span className="text-sm text-red-500">{errors[name]}</span>;
  }

  return "";
}

function TransferForm(props) {
  const original = useMemo(() => {
    const now = parseDate(new Date());
    const _original = {
      account_id: "",
      transferred_to: "",
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

  const errors = useMemo(
    () => (props.errors ? { ...formErrors, ...props.errors } : formErrors),
    [props.errors, formErrors]
  );

  useEffect(() => {
    getAccounts().then(console.log).catch(console.error);
  }, [getAccounts]);

  function onSubmit(data) {
    if (props.onSubmit) {
      props.onSubmit({
        account_id: data.account_id,
        transferred_to: data.transferred_to,
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
            messages={mapError(errors, "amount")}
          />
          {accountsLoading ? (
            <div>Loading...</div>
          ) : (
            <Select
              label="From account"
              name="account_id"
              required
              options={accounts.map((a) => ({
                name: `${a.name} (${a.current_balance.amount} ${a.current_balance.currency})`,
                value: a.id,
              }))}
              messages={mapError(errors, "account_id")}
            />
          )}
          {accountsLoading ? (
            <div>Loading...</div>
          ) : (
            <Select
              label="To account"
              name="transferred_to"
              required
              options={accounts.map((a) => ({
                name: `${a.name} (${a.current_balance.amount} ${a.current_balance.currency})`,
                value: a.id,
              }))}
              messages={mapError(errors, "transferred_to")}
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

TransferForm.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  errors: PropTypes.object,
};

export default TransferForm;
