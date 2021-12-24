import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { colorMap } from "../colors";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { classname, isDarkColor } from "../utils";
import DangerButton from "./DangerButton";
import Modal from "./Modal";

function ColorPickerPanel(props) {
  const { value, onClosePanel, onValueSelected } = props;

  const selectedRef = useRef(null);

  const colorListContent = useMemo(
    () =>
      Object.entries(colorMap)
        .filter(([, value]) => typeof value != "string")
        .flatMap(([name, colors]) =>
          Object.entries(colors).map(([tone, color]) => {
            const isSelected = color === value;
            const isDark = isDarkColor(color, -80);

            return (
              <li
                ref={isSelected ? selectedRef : undefined}
                role="menuitem"
                key={`${name}-${tone}-${color}`}
                className={classname(
                  {
                    "shadow-xl outline outline-6": isSelected,
                    "shadow-sm hover:outline hover:outline-6": !isSelected,
                    "outline-blue-400": isDark,
                    "outline-blue-500": !isDark,
                  },
                  "w-6 h-6 rounded-full cursor-pointer transition-all duration-100 sm:w-auto sm:h-8 sm:rounded-lg lg:h-9"
                )}
                style={{ backgroundColor: color }}
                onClick={() => onValueSelected(color)}
              />
            );
          })
        ),
    [value, onValueSelected]
  );

  useEffect(() => {
    setTimeout(() => {
      if (selectedRef.current) selectedRef.current.scrollIntoView();
    }, 0);
  }, []);

  return (
    <div className="w-[90%] h-[90%] max-h-screen shadow-md p-4 bg-white overflow-y-auto md:w-4/6 md:h-5/6">
      <div className="flex justify-end items-center pb-4 space-x-2">
        <div className="h-full flex-grow text-gray-500">Click a color to select it</div>

        <div className="h-full">
          <DangerButton onClick={onClosePanel}>Close</DangerButton>
        </div>
      </div>

      <div className="w-full max-h-[90%] overflow-y-scroll">
        <ul role="menu" className="grid grid-cols-10 gap-1 w-full p-2 overflow-x-hidden sm:gap-2">
          {colorListContent}
        </ul>
      </div>
    </div>
  );
}

function ColorPicker(props) {
  const formContext = useFormContext();

  const { name, label, required, messages = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(null);
  const textStyle = useComputeTextColor(internalValue);

  const [isOpen, setOpen] = useState(false);

  function closePanel() {
    setOpen(false);
  }

  function handleOpenPanel() {
    setOpen(true);
  }

  const handleValueSelected = useCallback(
    (color) => {
      formContext.setValue(props.name, color);
      closePanel();
    },
    [formContext, props.name]
  );

  function handleValueClear(ev) {
    ev.stopPropagation();
    formContext.setValue(props.name, "");
  }

  // Updates the internal value if the form value changes.
  formContext.watch((state) => {
    setInternalValue(state[name]);
  });

  useEffect(() => {
    setInternalValue(formContext.getValues()[name]);
  }, [formContext, name]);

  return (
    <div className="relative flex justify-between items-start">
      {label ? (
        <label htmlFor={name} className="w-full md:w-4/12 py-2">
          {label}
        </label>
      ) : (
        ""
      )}

      {/* Input container */}
      <div className="w-full md:w-8/12">
        {/* This is the input that shows the current value, but it is not connected to the form. */}
        <div
          className="form-input form-input-block flex justify-between items-center"
          onClick={handleOpenPanel}
        >
          {internalValue ? (
            <>
              <span className="inline-block h-full -my-2 rounded-lg p-1" style={textStyle}>
                {internalValue}
              </span>
              <button
                className="inline-block w-6 h-6 rounded-full bg-charcoal text-paper"
                onClick={handleValueClear}
              >
                <span className="material-icons">close</span>
              </button>
            </>
          ) : (
            <span className="text-gray-500">Click to pick a color</span>
          )}
        </div>

        {/* Hidden input connected to the form. */}
        <input
          hidden
          id={name}
          name={name}
          {...rest}
          {...formContext.register(name, { required })}
        />
        {messages}
      </div>

      <Modal isOpen={isOpen} onClose={closePanel}>
        <ColorPickerPanel
          value={internalValue}
          onValueSelected={handleValueSelected}
          onClosePanel={closePanel}
        />
      </Modal>
    </div>
  );
}

ColorPickerPanel.propTypes = {
  value: PropTypes.string,
  onClosePanel: PropTypes.func,
  onCancelClosePanel: PropTypes.func,
  onValueSelected: PropTypes.func,
};

ColorPicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  messages: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default ColorPicker;
