import PropTypes from "prop-types";
import React from "react";
import useComputeTextColor from "../hooks/useComputeTextColor";

function CategoriesListItem(props) {
  const buttonStyle = useComputeTextColor(props.color);

  return (
    <button
      className="w-full rounded-md shadow-sm px-4 py-4"
      style={buttonStyle}
      onClick={props.onClick}
    >
      <div className="pb-2 text-left">{props.name}</div>
      <div className="flex justify-end">
        <span className="material-icons">{props.icon}</span>
      </div>
    </button>
  );
}

CategoriesListItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  for_expenses: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CategoriesListItem;
