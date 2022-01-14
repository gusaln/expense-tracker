import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { colorMap } from "../colors";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { classname, isDarkColor } from "../utils";
import Card from "./Card";
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
    <div className="w-[90%] h-[90%] max-h-screen overflow-y-scroll md:w-4/6 md:h-5/6">
      <Card>
        <div className="flex justify-end items-center pb-4 space-x-2">
          <div className="h-full flex-grow text-gray-400">Click a color to select it</div>
          <div className="h-full">
            <DangerButton onClick={onClosePanel}>Close</DangerButton>
          </div>
        </div>
        <div className="w-full">
          <ul role="menu" className="grid grid-cols-10 gap-1 w-full p-2 overflow-x-hidden sm:gap-2">
            {colorListContent}
          </ul>
        </div>
      </Card>
    </div>
  );
}

const ColorPicker = forwardRef((props, ref) => {
  const { name, value = "", onChange = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(null);
  const textStyle = useComputeTextColor(internalValue);

  const [isOpen, setOpen] = useState(false);

  function closePanel() {
    setOpen(false);
  }

  function handleOpenPanel() {
    setOpen(true);
  }

  const setValue = useCallback(
    (value) => {
      setInternalValue(value);
      onChange?.(value);
    },
    [onChange]
  );

  const handleValueSelected = useCallback(
    (color) => {
      setValue(color);
      closePanel();
    },
    [setValue]
  );

  function handleValueClear(ev) {
    ev.stopPropagation();
    setValue("");
  }

  // Updates the internal value if the form value changes.
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closePanel}>
        <ColorPickerPanel
          value={internalValue}
          onValueSelected={handleValueSelected}
          onClosePanel={closePanel}
        />
      </Modal>

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
          <span className="text-gray-400">Click to pick a color</span>
        )}
      </div>

      {/* Hidden input connected to the form. */}
      <input hidden id={name} name={name} ref={ref} {...rest} />
    </>
  );
});

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
};

export default ColorPicker;
