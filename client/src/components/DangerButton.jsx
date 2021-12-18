import PropTypes from "prop-types";
import React from "react";
import BaseButton from "./BaseButton";

function DangerButton(props) {
  return (
    <BaseButton
      {...props}
      normalClasses="text-paper bg-red-600 hover:bg-red-400"
      textClasses="text-charcoal hover:bg-red-300"
      disabledClasses="text-paper bg-paper-light"
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
