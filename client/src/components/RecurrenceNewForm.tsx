import { ReactElementLike } from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { FieldError, FormProvider, useForm } from "react-hook-form";
import RRule, { Frequency } from "rrule";
import { getRecurrenceText, passUndefinedIfNotFilled } from "../utils";
import Button from "./Button";
import Card from "./Card";
import FormField from "./FormField";
import MonthDayPicker from "./MonthDayPicker";
import Select from "./Select";
import TextInput from "./TextInput";

function mapError(errors: Record<string, FieldError | string>, name: string) {
  if (errors[name]) {
    return <span className="text-sm text-red-500">{errors[name]}</span>;
  }

  return "";
}

interface RecurrenceNewFormProps {
  // title: string;
  // buttonText: string;
  titleAddon?: ReactElementLike;
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  original?: {
    recur_freq: keyof typeof Frequency;
    recur_interval: number | string;
    // recur_wkst: "",
    recur_bymonth: (number | string)[];
    // recur_byweekno: "",
    // recur_byyearday: "",
    recur_bymonthday: (number | string)[];
    // recur_byday: (number | string)[];
    // recur_byhour: "",
    // recur_byminute: "",
    // recur_bysecond: "",
    // recur_bysetpos: "",
    // recur_until: "",
    // recur_count: "",
  };
  errors: Record<string, string>;
}

function RecurrenceNewForm(props: RecurrenceNewFormProps) {
  const original = useMemo(() => {
    const _original = {
      recur_freq: "MONTHLY",
      recur_interval: "1",
      // recur_wkst: "",
      recur_bymonth: [],
      // recur_byweekno: "",
      // recur_byyearday: "",
      recur_bymonthday: [],
      // recur_byday: [],
      // recur_byhour: "",
      // recur_byminute: "",
      // recur_bysecond: "",
      // recur_bysetpos: "",
      // recur_until: "",
      // recur_count: "",
    };

    if (props.original) {
      Object.keys(_original).forEach((attr) => (_original[attr] = props.original[attr]));
    }

    return _original;
  }, [props.original]);

  const formContext = useForm({ defaultValues: original });
  const {
    watch,
    reset,
    handleSubmit,
    formState: { errors: formErrors },
  } = formContext;

  const errors = useMemo(
    () => (props.errors ? { ...formErrors, ...props.errors } : formErrors),
    [props.errors, formErrors]
  );

  const [repeatingEveryString, setRepeatingEveryString] = useState(
    () => getRecurrenceText(formContext.getValues()) || ""
  );

  function onSubmit(data) {
    props?.onSubmit({
      recur_freq: data.recur_freq,
      recur_interval: Number(data.recur_interval),
      // recur_wkst: data.recur_wkst,
      recur_bymonth: passUndefinedIfNotFilled(data.recur_bymonth)?.map((s) => Number(s)),
      // recur_byweekno: data.recur_byweekno,
      // recur_byyearday: data.recur_byyearday,
      recur_bymonthday: passUndefinedIfNotFilled(data.recur_bymonthday)?.map((s) => Number(s)),
      // recur_byday: passUndefinedIfNotFilled(data.recur_byday)?.map((s) => Number(s)),
      // recur_byhour: data.recur_byhour,
      // recur_byminute: data.recur_byminute,
      // recur_bysecond: data.recur_bysecond,
      // recur_bysetpos: data.recur_bysetpos,
      // recur_until: data.recur_until,
      // recur_count: data.recur_count,
    });
  }

  function onCancel() {
    reset();
    props?.onCancel();
  }

  useEffect(() => {
    const subscription = watch((data) => {
      setRepeatingEveryString(getRecurrenceText(data) || "");
    }, original);
    return () => subscription.unsubscribe();
  }, [original, watch]);

  return (
    <Card title="Recurrence" titleAddon={props.titleAddon}>
      <FormProvider {...formContext}>
        <form className="space-y-4" action="" method="post" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <em>
              <small>{repeatingEveryString}</small>
            </em>
          </div>

          <FormField
            label="Frequency"
            name="recur_freq"
            required
            messages={mapError(errors, "recur_freq")}
            input={(props) => (
              <Select
                {...props}
                placeholder="Choose a frequency"
                options={RRule.FREQUENCIES.map((f) => ({ name: f, value: f }))}
              />
            )}
          />

          <FormField
            label="Interval"
            name="recur_interval"
            messages={mapError(errors, "recur_interval")}
            required
            input={(props) => (
              <TextInput
                {...props}
                placeholder="How many days/months/years between repeats?"
                type="number"
              />
            )}
          />

          <FormField
            label="Days of the month"
            name="recur_bymonthday"
            messages={mapError(errors, "recur_bymonthday")}
            controlled
            input={(props) => <MonthDayPicker {...props} />}
          />

          {/* <FormField
            label="Months"
            name="recur_bymonth"
            messages={mapError(errors, "recur_bymonth")}
            input={(props) => <MonthPicker {...props} />}
          /> */}

          <div className="flex justify-end pt-4 space-x-4">
            <Button type="submit">Accept</Button>
            <Button text onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}

export default RecurrenceNewForm;
