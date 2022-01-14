import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const Select = forwardRef(({ name, options, placeholder = undefined, ...rest }, ref) => {
  return (
    <select className="form-input form-input-block" defaultValue="" id={name} name={name} {...rest} ref={ref}>
      {placeholder && (
        <option className="text-gray-400" value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.name}
        </option>
      ))}
    </select>
  );
});

Select.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Select;
