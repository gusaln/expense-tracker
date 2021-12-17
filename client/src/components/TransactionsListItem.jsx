import PropTypes from "prop-types";
import React, { useMemo } from "react";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { formatNumber } from "../utils";
import TimeValue from "./TimeValue";

function TransactionsListItem(props) {
  const categoryColor = useMemo(
    () => (props.type === "transfer" ? "#c0c0c0" : props.category.color),
    [props.type, props.category]
  );
  const categoryStyle = useComputeTextColor(categoryColor);

  return (
    <div className="flex rounded-md p-2 hover:bg-gray-50 transition duration-200 ease-in-out">
      <div>
        <div
          className="h-10 w-10 mr-2 mt-1 pt-2 rounded-lg text-center"
          style={categoryStyle}
        >
          <span className="material-icons">
            {props.type === "transfer" ? "arrow_forward" : props.category.icon}
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex justify-between text-xl">
          <div>{props.description}</div>
          <div className={props.type === "expense" ? "text-red-500" : "text-blue-500"}>
            {formatNumber(props.amount)}
          </div>
        </div>

        <div className="flex justify-between text-gray-500">
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
  account_id: PropTypes.number.isRequired,
  account: PropTypes.object.isRequired,
  category_id: PropTypes.number,
  category: PropTypes.object,
  description: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  transferred_to: PropTypes.number,
  transferred_to_account: PropTypes.object,
  date: PropTypes.string.isRequired,
};

export default TransactionsListItem;
