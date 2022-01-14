import React from "react";
import PropTypes from "prop-types";

function LoadingWhile(props) {
  if (props.isLoading) {
    <div>Loading...</div>;
  }

  return <>{props.children}</>;
}

LoadingWhile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default LoadingWhile;
