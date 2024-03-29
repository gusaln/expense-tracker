import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useAccounts from "../hooks/useAccounts";
import { parseDate } from "../utils";
import Button from "./Button";
import Card from "./Card";
import DateInput from "./DateInput";
import FormField from "./FormField";
import LoadingWhile from "./LoadingWhile";
import Select from "./Select";
import TextInput from "./TextInput";
import TimeInput from "./TimeInput";

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

  const formContext = useForm({ defaultValues: original });
  const {
    reset,
    handleSubmit,
    formState: { errors: formErrors },
  } = formContext;

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
      <FormProvider {...formContext}>
        <form className="space-y-4" action="" method="post" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Description"
            name="description"
            required
            messages={mapError(errors, "description")}
            input={(props) => <TextInput {...props} />}
          />

          <FormField
            label="Amount"
            name="amount"
            required
            messages={mapError(errors, "amount")}
            input={(props) => <TextInput {...props} />}
          />

          <FormField
            label="From account"
            name="account_id"
            required
            messages={mapError(errors, "account_id")}
            input={(props) => (
              <LoadingWhile isLoading={accountsLoading}>
                <Select
                  {...props}
                  options={accounts.map((a) => ({
                    name: `${a.name} (${a.current_balance.amount} ${a.current_balance.currency})`,
                    value: a.id,
                  }))}
                />
              </LoadingWhile>
            )}
          />

          <FormField
            label="To account"
            name="transferred_to"
            required
            messages={mapError(errors, "transferred_to")}
            input={(props) => (
              <LoadingWhile isLoading={accountsLoading}>
                <Select
                  {...props}
                  options={accounts.map((a) => ({
                    name: `${a.name} (${a.current_balance.amount} ${a.current_balance.currency})`,
                    value: a.id,
                  }))}
                />
              </LoadingWhile>
            )}
          />

          <FormField
            label="Date"
            name="date"
            required
            messages={mapError(errors, "date")}
            input={(props) => <DateInput {...props} />}
          />

          <FormField
            label="Time"
            name="time"
            type="time"
            required
            input={(props) => <TimeInput {...props} />}
          />

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
