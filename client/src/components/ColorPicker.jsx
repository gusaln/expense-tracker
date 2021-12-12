import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import colorsMap from "../colors";
import { useFormContext } from "react-hook-form";
import useComputeTextColor from "../hooks/useComputeTextColor";
import { classname } from "../utils";

const colors = Object.entries(colorsMap).reduce(
  (prev, [, tones]) => prev.concat(Object.values(tones)),
  []
);

function ColorPickerPanel(props) {
  const { value, onClosePanel, onCancelClosePanel, onValueSelected } = props;

  const colorListContent = useMemo(
    () =>
      colors.map((color) => (
        <li
          id={`color-${color.replace("#", "")}`}
          role="menuitem"
          key={color}
          className={classname(
            {
              "my-6 shadow-lg": color === value,
              "mb-2 hover:shadow-md": color !== value,
            },
            "w-full h-8 rounded-lg cursor-pointer transition-all duration-200 ease-out"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onValueSelected(color)}
        />
      )),
    [value, onValueSelected]
  );

  return (
    <div
      className="z-50 w-full absolute top-1/2 right-0 md:w-8/12"
      onMouseLeave={onClosePanel}
      onMouseEnter={onCancelClosePanel}
    >
      <div className="w-full h-52 m-2 shadow-md p-6 bg-white overflow-x-hidden overflow-y-scroll">
        <ul role="menu" className="w-full">
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
  const timeoutHandler = useRef(null);

  function closePanel() {
    timeoutHandler.current = setTimeout(() => {
      setOpen(false);
      timeoutHandler.current = null;
    }, 300);
  }

  function cancelClosePanel() {
    if (timeoutHandler.current) clearTimeout(timeoutHandler.current);
  }

  function handleOpenPanel() {
    setOpen(true);
    // Uses a delay to give time to the dom to update and show the panel.
    setTimeout(() => {
      if (internalValue) {
        document
          .querySelector(`#color-${internalValue.replace("#", "")}`)
          .scrollIntoView();
      }
    }, 0);
  }

  const handleValueSelected = useCallback(
    (color) => {
      formContext.setValue(props.name, color);
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
          className="w-full h-11 flex justify-between items-center border rounded p-2 focus:border-2 focus:border-gray-400 hover:border-gray-400"
          onClick={handleOpenPanel}
        >
          {internalValue ? (
            <>
              <span
                className="inline-block h-full -my-2 rounded-lg p-1"
                style={textStyle}
              >
                {internalValue}
              </span>
              <button
                className="inline-block w-6 h-6 rounded-full bg-gray-900 text-gray-100"
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

      {isOpen ? (
        <ColorPickerPanel
          value={internalValue}
          onValueSelected={handleValueSelected}
          onClosePanel={closePanel}
          onCancelClosePanel={cancelClosePanel}
        />
      ) : (
        ""
      )}
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
