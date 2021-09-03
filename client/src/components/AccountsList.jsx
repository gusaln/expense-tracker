import React from "react";
import PropTypes from "prop-types";
import AccountsListItem from "./AccountsListItem";
import { Link } from "react-router-dom";

function AccountsList(props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {props.accounts.length === 0 ? (
        <div>There are no accounts</div>
      ) : (
        props.accounts.map((account) => (
          <Link to={`/accounts/${account.id}`} key={account.id}>
            <AccountsListItem key={account.id} {...account} />
          </Link>
        ))
      )}
    </div>
  );
}
AccountsList.propTypes = {
  accounts: PropTypes.array,
};

export default AccountsList;
