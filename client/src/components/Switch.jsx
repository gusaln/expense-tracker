import PropTypes from "prop-types";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { classname } from "../utils";

function Switch(props) {
  const { register, watch, getValues, setValue } = useFormContext();
  const { name, label, trueLabel, falseLabel, required, messages = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(() => getValues()[name]);

  watch((state) => {
    setInternalValue(state[name]);
  });

  return (
    <div className="flex justify-between items-start">
      <label htmlFor={name} className="w-full md:w-4/12 py-2">
        {label}
      </label>

      <div className="w-full h-11 flex justify-between items-center md:w-8/12">
        <div>{falseLabel}</div>

        <div className="h-full flex justify-center items-center flex-grow">
          <div
            className="relative w-12 h-6 rounded-full border-2 border-gray-300 bg-paper"
            onClick={() => setValue(name, !internalValue)}
          >
            <div
              className={classname(
                {
                  "translate-x-full": internalValue,
                  "": !internalValue,
                },
                "absolute w-6 h-6 rounded-full bg-charcoal transform transition-all duration-500"
              )}
            />
          </div>
        </div>

        <div>{trueLabel}</div>
      </div>

      <input hidden id={name} name={name} {...rest} {...register(name, { required })} />
      {messages}
    </div>
  );
}

Switch.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
  required: PropTypes.bool,
  messages: PropTypes.element,
};

export default Switch;
