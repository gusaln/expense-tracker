import { useCallback, useState } from "react";
import { fetchTransactions } from "../api";

export default function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const getTransactions = useCallback(async (search = null) => {
    setLoading(true);
    setTransactions(await fetchTransactions(search));
    setLoading(false);
  }, []);

  return {
    transactions,
    isLoading,
    getTransactions,
  };
}
