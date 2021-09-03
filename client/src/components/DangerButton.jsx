import React from "react";
import PropTypes from "prop-types";
import BaseButton from "./BaseButton";

function DangerButton(props) {
  return (
    <BaseButton
      {...props}
      normalClasses="text-gray-100 bg-red-600 hover:bg-red-400"
      textClasses="text-gray-900 hover:bg-red-300"
      disabledClasses="text-gray-100 bg-gray-200"
    />
  );

}

DangerButton.propTypes = {
  type: PropTypes.oneOf(["submit"]),
  small: PropTypes.bool,
  text: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DangerButton;
