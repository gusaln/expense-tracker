import PropTypes from "prop-types";
import React from "react";

function LoadingWhile(props) {
  if (props.isLoading) {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
}

LoadingWhile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default LoadingWhile;
