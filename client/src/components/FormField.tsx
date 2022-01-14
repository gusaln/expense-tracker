import React, { ReactElement, ReactNode } from "react";
import { Controller, ControllerRenderProps, useFormContext, UseFormRegisterReturn } from "react-hook-form";

interface LabelRenderProps {
  name: string;
}

interface InputRenderProps extends UseFormRegisterReturn {
}

interface FormFieldProps {
  name: string;
  label?: ReactNode | ((props: LabelRenderProps) => ReactNode);
  /** Render prop for an uncontrolled input. */
  input: (props: InputRenderProps|ControllerRenderProps) => ReactNode;
  controlled?: boolean;
  required?: boolean;
  messages?: ReactNode;
}

function FormField({ name, label = "", input, controlled = false, required = false, messages }: FormFieldProps) {
  const { register, control } = useFormContext();

  return (
    <div className="flex justify-between items-start">
      {typeof label == "function" ? (
        label({ name })
      ) : (
        <label htmlFor={name} className="w-full md:w-4/12 py-2">
          {label}
        </label>
      )}

      <div className="w-full md:w-8/12">
        {controlled
          ?  <Controller
          control={control}
          name={name}
          render={({ field }) => input({ ...field }) as ReactElement}
        />
          : input({ ...register(name, { required }) })
          }

        {messages}
      </div>
    </div>
  );
}

export default FormField;
