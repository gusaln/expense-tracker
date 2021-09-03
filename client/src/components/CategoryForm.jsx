import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import TextInput from "./TextInput";
import Button from "./Button";
import { FormProvider, useForm } from "react-hook-form";
import ColorPicker from "./ColorPicker";
import Switch from "./Switch";

function mapError(errors, name) {
  if (errors[name]) {
    return <span className="text-sm text-red-500">{errors[name]}</span>;
  }

  return "";
}

function CategoryForm(props) {
  const original = useMemo(() => {
    const _original = {
      name: "",
      icon: "",
      color: "",
      for_expenses: true,
    };

    if (props.original) {
      Object.keys(_original).forEach((attr) => {
        const value = props.original[attr];

        _original[attr] = value;
      });
    }

    return _original;
  }, [props.original]);

  const methods = useForm({ defaultValues: original });
  const {
    reset,
    handleSubmit,
    formState: { errors: formErrors },
  } = methods;

  const errors = useMemo(
    () => (props.errors ? { ...formErrors, ...props.errors } : formErrors),
    [props.errors, formErrors]
  );

  function onSubmit(data) {
    if (props.onSubmit) {
      props.onSubmit({
        name: data.name,
        icon: data.icon,
        color: data.color,
        for_expenses: data.for_expenses,
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
            label="Name"
            name="name"
            required
            messages={mapError(errors, "name")}
          />
          {/* <TextInput
            label="Icon"
            name="icon"
            required
            messages={mapError(errors, "icon")}
          /> */}
          <ColorPicker
            label="Color"
            name="color"
            required
            messages={mapError(errors, "color")}
          />

          <Switch
            trueLabel="For expenses"
            falseLabel="For incomes"
            name="for_expenses"
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

CategoryForm.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  errors: PropTypes.object,
};

export default CategoryForm;
