import PropTypes from "prop-types";
import React from "react";
import BaseButton from "./BaseButton";

function Button(props) {
  return (
    <BaseButton
      {...props}
      normalClasses="text-paper bg-charcoal hover:bg-gray-700"
      textClasses="text-charcoal hover:bg-gray-300"
      disabledClasses="text-paper bg-gray-500"
    />
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["submit"]),
  small: PropTypes.bool,
  text: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

export default Button;
