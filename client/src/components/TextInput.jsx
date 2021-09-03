import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

function TextInput(props) {
  const { register } = useFormContext();
  const { name, label, required, messages = null, ...rest } = props;

  return (
    <div className="flex justify-between items-start">
      {label ? (
        <label htmlFor={name} className="w-full md:w-4/12 py-2">
          {label}
        </label>
      ) : (
        ""
      )}

      <div className="w-full md:w-8/12">
        <input
          className="w-full border rounded p-2 focus:border-2 focus:border-gray-400 hover:border-gray-400"
          id={name}
          name={name}
          {...rest}
          {...register(name, { required })}
        />
        {messages}
      </div>
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  messages: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default TextInput;
