import PropTypes from "prop-types";
import React from "react";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { formatNumber } from "../utils";

function AccountsListItem(props) {
  const buttonStyle = useComputeTextColor(props.color);

  return (
    <button
      className="w-full rounded-md shadow-sm px-4 py-4"
      style={buttonStyle}
      onClick={props.onClick}
    >
      <div className="flex justify-between pb-2 text-lg text-left">
        {props.name}

        <span className="text-xl">
          {formatNumber(props.current_balance.amount)}
        </span>
      </div>

      <div className="flex justify-end">
        <span className="material-icons">{props.icon}</span>
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
