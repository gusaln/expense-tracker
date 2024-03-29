import PropTypes from "prop-types";
import React from "react";

function BaseButton(props) {
  const { text, small, onClick, normalClasses, textClasses, disabledClasses, ...rest } = props;
  const classes = [
    "flex justify-center items-center rounded-md transition duration-200 ease-in-out",
  ];

  if (props.disabled) {
    classes.push(disabledClasses || "text-paper bg-gray-500");
  } else if (text) {
    classes.push(textClasses || "text-charcoal hover:bg-gray-300");
  } else {
    classes.push(normalClasses || "text-paper bg-charcoal hover:bg-gray-700");
  }
  classes.push(small ? "p-1 text-sm" : "p-2");

  return (
    <button {...rest} onClick={props.disabled ? undefined : onClick} className={classes.join(" ")}>
      {props.children}
    </button>
  );
}

BaseButton.propTypes = {
  type: PropTypes.oneOf(["submit"]),
  small: PropTypes.bool,
  text: PropTypes.bool,
  disabled: PropTypes.bool,
  normalClasses: PropTypes.string,
  disabledClasses: PropTypes.string,
  textClasses: PropTypes.string,
};

export default BaseButton;
