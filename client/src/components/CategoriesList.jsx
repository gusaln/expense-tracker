import React from "react";
import PropTypes from "prop-types";
import CategoriesListItem from "./CategoriesListItem";
import { Link } from "react-router-dom";

function CategoriesList(props) {
  if (props.categories.length === 0) {
    return <div>There are no categories.</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {props.categories.map((t) => (
        <Link to={`/categories/${t.id}`} key={t.id}>
          <CategoriesListItem {...t} />
        </Link>
      ))}
    </div>
  );
}

CategoriesList.propTypes = {
  categories: PropTypes.array,
};

export default CategoriesList;
