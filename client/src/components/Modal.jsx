import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

function ModalBackground(props) {
  return (
    <div
      id='modal-bg'
      onClick={(ev) => ev.target.id === 'modal-bg' && props.onClose()}
      className="absolute top-0 w-full h-full z-50 flex justify-center items-center bg-charcoal bg-opacity-60"
    >
      {props.children}
    </div>
  );
}

export default function Modal(props) {
  return ReactDOM.createPortal(
    <>
      {props.isOpen && <ModalBackground onClose={props.onClose}>{props.children}</ModalBackground>}
    </>,
    document.querySelector("#root-modal")
  );
}

Modal.propType = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
