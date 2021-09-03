import React from "react";
import PropTypes from "prop-types";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { formatNumber } from "../utils";

function AccountsListItem(props) {
  const buttonStyle = useComputeTextColor(props.color);

  return (
    <button
      className="w-full flex justify-between items-center rounded-md px-4"
      style={buttonStyle}
      onClick={props.onClick}
    >
      <div className="h-20 flex items-center space-x-2">
        <span>{props.name}</span>
        <span className="material-icons -mt-1">{props.icon}</span>
      </div>

      <div>
        {formatNumber(props.current_balance.amount)}
      </div>
    </button>
  );
}

AccountsListItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  currency: PropTypes.string,
  onClick: PropTypes.func,
};

export default AccountsListItem;
