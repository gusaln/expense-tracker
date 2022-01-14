import React, { useEffect } from "react";
import useAccounts from "../hooks/useAccounts";
import AccountsList from "./AccountsList";
import Card from "./Card";

export default function AccountsPanel() {
  const { accounts, isLoading, getAccounts } = useAccounts();

  useEffect(() => {
    getAccounts().then(console.log).catch(console.error);
  }, [getAccounts]);

  return (
    <div>
      <Card
        title="Accounts"
        titleAddon={
          <input
            className="form-input"
            name="search"
            placeholder="Filter accounts"
          />
        }
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-400">Click one to edit it</p>
            <AccountsList accounts={accounts} />
          </>
        )}
      </Card>
    </div>
  );
}
