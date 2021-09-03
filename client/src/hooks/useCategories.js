import { useCallback, useState } from "react";
import { fetchCategories } from "../api";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const getCategories = useCallback(async (search) => {
    setLoading(true);
    setCategories(await fetchCategories(search));
    setLoading(false);
  }, []);

  return {
    categories,
    isLoading,
    getCategories,
  };
}
