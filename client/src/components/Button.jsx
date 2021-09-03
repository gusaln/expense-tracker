import React from "react";
import PropTypes from "prop-types";
import BaseButton from "./BaseButton";

function Button(props) {
  return (
    <BaseButton
      {...props}
      normalClasses="text-gray-100 bg-gray-900 hover:bg-gray-700"
      textClasses="text-gray-900 hover:bg-gray-300"
      disabledClasses="text-gray-100 bg-gray-500"
    />
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["submit"]),
  small: PropTypes.bool,
  text: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Button;
