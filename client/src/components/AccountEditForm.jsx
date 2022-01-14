import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "./Button";
import Card from "./Card";
import ColorPicker from "./ColorPicker";
import FormField from "./FormField";
import IconPicker from "./IconPicker";
import TextInput from "./TextInput";

function mapError(errors, name) {
  if (errors[name]) {
    return <span className="text-sm text-red-500">{errors[name]}</span>;
  }

  return "";
}

function AccountEditForm(props) {
  const original = useMemo(() => {
    const _original = {
      name: "",
      icon: "",
      color: "",
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

  function submit(data) {
    if (props.onSubmit) {
      props.onSubmit({
        name: data.name,
        icon: data.icon,
        color: data.color,
      });
    }
  }

  return (
    <Card title={props.title}>
      <FormProvider {...methods}>
        <form className="space-y-4" action="" method="post" onSubmit={handleSubmit(submit)}>
          <FormField
            label="Name"
            name="name"
            required
            messages={mapError(errors, "name")}
            input={(props) => <TextInput {...props} />}
          />
          <FormField
            label="Icon"
            name="icon"
            required
            messages={mapError(errors, "icon")}
            input={(props) => <IconPicker {...props} />}
          />
          <FormField
            label="Color"
            name="color"
            required
            messages={mapError(errors, "color")}
            input={(props) => <ColorPicker {...props} />}
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

AccountEditForm.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  errors: PropTypes.object,
};

export default AccountEditForm;
