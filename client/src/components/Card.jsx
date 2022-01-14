import PropTypes from "prop-types";
import React from "react";

function Card(props) {
  return (
    <div className="flex-grow shadow-sm rounded p-6 bg-white">
      {props.title || props.titleAddon ? (
        <div className="mb-4 flex justify-between">
          {props.title ? <h3 className="text-lg font-semibold">{props.title}</h3> : ""}
          {props.titleAddon}
        </div>
      ) : (
        ""
      )}

      {props.children}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  titleAddon: PropTypes.element,
  children: PropTypes.any,
};

export default Card;
