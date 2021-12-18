import PropTypes from "prop-types";
import React from "react";

const boxColorMap = {
  success: "bg-green-500",
  info: "bg-blue-500",
  error: "bg-red-500",
};

const closeBtnColorMap = {
  success: "bg-green-700 hover:bg-green-600",
  info: "bg-blue-700 hover:bg-blue-600",
  error: "bg-red-700 hover:bg-red-600",
};

function Alert(props) {
  const boxClasses =
    "flex justify-between mb-6 rounded-md p-4 text-paper " +
    boxColorMap[props.type];

  const closeBtnClasses =
    "h-6 w-6 rounded-full transiton-all " + closeBtnColorMap[props.type];

  return (
    <div className={boxClasses}>
      {props.children}

      {props.closable ? (
        <button onClick={props.onClose} className={closeBtnClasses}>
          <span className="material-icons">close</span>
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "info", "error"]),
  closable: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Alert;
