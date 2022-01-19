import PropTypes from "prop-types";
import React from "react";
import { paperDark } from "../colors";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { formatNumber } from "../utils";
import Icon from "./Icon";
import TimeValue from "./TimeValue";

function TransactionsListItem(props) {
  const categoryBgColor = props.type === "transfer" ? paperDark : props.category.color;
  const categoryStyle = useComputeTextColor(
    categoryBgColor,
    `trans item ${props.type} ${props.amount}`
  );

  return (
    <div className="flex rounded-md p-2 hover:bg-paper-light transition duration-200 ease-in-out">
      <div>
        <div className="h-10 w-10 mr-2 mt-1 pt-2 rounded-lg text-center" style={categoryStyle}>
          <span className="material-icons">
            {props.type === "transfer" ? "arrow_forward" : props.category.icon}
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex justify-between text-xl">
          <div className="flex items-center">
            <span>{props.description}</span>
            {props.recurrence_id && <Icon value="repeat"/> }
          </div>
          <div className={props.type === "expense" ? "text-red-500" : "text-blue-500"}>
            {formatNumber(props.amount)}
          </div>
        </div>

        <div className="flex justify-between text-gray-400">
          {props.type === "transfer" ? (
            <div>
              {props.account.name} -&gt; {props.transferred_to_account.name}
            </div>
          ) : (
            <div>{props.account.name}</div>
          )}
          <div>
            <TimeValue value={props.date} />
          </div>
        </div>
      </div>
    </div>
  );
}

TransactionsListItem.propTypes = {
  // id: PropTypes.string,
  type: PropTypes.oneOf(["income", "expense", "transfer"]).isRequired,
  recurrence_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  account_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  account: PropTypes.object.isRequired,
  category_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  category: PropTypes.object,
  description: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  transferred_to: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  transferred_to_account: PropTypes.object,
  date: PropTypes.string.isRequired,
};

export default TransactionsListItem;
