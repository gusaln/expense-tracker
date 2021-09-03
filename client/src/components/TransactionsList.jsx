import React from "react";
import PropTypes from "prop-types";
import TransactionsListItem from "./TransactionsListItem";
import { Link } from "react-router-dom";

function TransactionsList(props) {
  if (props.transactions.length === 0) {
    return <div>There are no transactions.</div>
  }

  return (
    <div>
      {props.transactions.map((t) => (
        <Link to={`/${t.type}s/${t.id}`} key={t.id}>
          <TransactionsListItem {...t} />
        </Link>
      ))}
    </div>
  );
}

TransactionsList.propTypes = {
  transactions: PropTypes.array,
};

export default TransactionsList;
