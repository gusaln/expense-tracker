import React, { useEffect, useMemo } from "react";
import useCategories from "../hooks/useCategories";
import CategoriesList from "./CategoriesList";
import Card from "./Card";

function CategoriesPanel() {
  const { categories, isLoading, getCategories } = useCategories();

  const incomesCategories = useMemo(
    () => categories.filter((c) => !c.for_expenses),
    [categories]
  );
  const expensesCategories = useMemo(
    () => categories.filter((c) => c.for_expenses),
    [categories]
  );

  useEffect(() => {
    getCategories().then(console.log).catch(console.error);
  }, [getCategories]);

  return (
    <div>
      <Card title="Categories">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <p className="text-sm text-gray-500">Click one to edit it</p>

            <h4 className="text-sm mt-4 mb-2">
              Categories for expenses
            </h4>
            <CategoriesList categories={expensesCategories} />

            <h4 className="text-sm mt-4 mb-2">
              Categories for incomes
            </h4>
            <CategoriesList categories={incomesCategories} />
          </>
        )}
      </Card>
    </div>
  );
}

CategoriesPanel.propTypes = {};

export default CategoriesPanel;
