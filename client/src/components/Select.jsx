import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

function Select(props) {
  const { register } = useFormContext();
  const { name, label, options, required, messages, ...rest } = props;

  return (
    <div className="flex justify-between items-start">
      {label ? (
        <label htmlFor={name} className="w-full md:w-4/12 py-2">
          {label}
        </label>
      ) : (
        ""
      )}

      <select
        className="w-full md:w-8/12 border rounded p-2 focus:border-gray-400 hover:border-gray-400"
        id={name}
        name={name}
        {...rest}
        {...register(name, { required })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.name}
          </option>
        ))}
      </select>

      {messages}
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  register: PropTypes.func.isRequired,
  required: PropTypes.bool,
  messages: PropTypes.element,
};

export default Select;
