import PropTypes from "prop-types";
import React from "react";

function TransactionGroupHeader(props) {
  return (
    <div className="flex justify-between items-end mb-2 py-2 px-4 bg-paper-dark text-charcoal">
      <div className="h-full w-10 text-3xl text-center">{props.day.split("-")[2]}</div>
    </div>
  );
}

TransactionGroupHeader.propTypes = {
  day: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(Date)]),
};

export default TransactionGroupHeader;
