import React from "react";
import PropTypes from "prop-types";
import useComputeTextColor from "../hooks/useComputeTextColor";

function CategoriesListItem(props) {
  const buttonStyle = useComputeTextColor(props.color);

  return (
    <button
      className="w-full flex justify-between items-center rounded-md px-4"
      style={buttonStyle}
      onClick={props.onClick}
    >
      <div className="h-20 flex flex-wrap items-center space-x-2">
        <span>{props.name}</span>
        <span className="material-icons -mt-1">{props.icon}</span>
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
