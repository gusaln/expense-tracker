import { useCallback, useState } from "react";
import { fetchAccounts } from "../api";

export default function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const getAccounts = useCallback(async() => {
    setLoading(true)
    setAccounts(await fetchAccounts())
    setLoading(false)
  }, []);

  return {
    accounts,
    isLoading,
    getAccounts
  };
}
