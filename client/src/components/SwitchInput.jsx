import PropTypes from "prop-types";
import React, { forwardRef, useEffect, useState } from "react";
import { classname } from "../utils";

const SwitchInput = forwardRef((props, ref) => {
  const {
    name,
    trueLabel,
    falseLabel,
    value = false,
    onChange = null,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState(value);

  function toggle() {
    setInternalValue(!internalValue);
    onChange && onChange(!internalValue);
  }

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <>
      <div className="w-full h-11 flex justify-between items-center">
        <div>{falseLabel}</div>

        <div className="h-full flex justify-center items-center flex-grow">
          <div
            className="relative w-12 h-6 rounded-full border-2 border-gray-300 bg-paper"
            onClick={toggle}
          >
            <div
              className={classname(
                {
                  "translate-x-full": internalValue,
                },
                "absolute w-6 h-6 rounded-full bg-charcoal transform transition-all duration-500"
              )}
            />
          </div>
        </div>

        <div>{trueLabel}</div>
      </div>

      <input hidden type="checkbox" id={name} name={name} ref={ref} {...rest} />
    </>
  );
});

SwitchInput.propTypes = {
  name: PropTypes.string,
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
  onChange: PropTypes.string,
};

export default SwitchInput;
