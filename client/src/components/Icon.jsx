import PropTypes from "prop-types";
import React from "react";

export default function Icon(props) {
  return <span className="material-icons">{props.children || props.value}</span>;
}

Icon.propType = {
  value: PropTypes.string.isRequired,
};
