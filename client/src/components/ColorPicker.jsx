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

function ColorPicker(props) {
  const formContext = useFormContext();

  const { name, label, required, messages = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(null);
  const textStyle = useComputeTextColor(internalValue);

  const [isOpen, setOpen] = useState(false);
  const timeoutHandler = useRef(null);
  const selectedItemRef = useRef(null);

  formContext.watch((state) => {
    setInternalValue(state[name]);
  });

  useEffect(() => {
    setInternalValue(formContext.getValues()[name]);
  }, [formContext, name]);

  function cancelCloseColorPanel() {
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
    }
  }

  function closeColorPanel() {
    timeoutHandler.current = setTimeout(() => {
      setOpen(false);
      timeoutHandler.current = null;
    }, 400);
  }

  function handleOpenPanel() {
    setOpen(true);
    setTimeout(() => {
      if (selectedItemRef.current) selectedItemRef.current.scrollIntoView();
    }, 0);
  }

  const handleValueSelected = useCallback(
    (color) => {
      formContext.setValue(props.name, color);
    },
    [formContext, props.name]
  );

  function handleValueClear() {
    formContext.setValue(props.name, "");
  }

  const colorListContent = useMemo(
    () =>
      colors.map((color) => (
        <li
          role="menuitem"
          key={color}
          ref={color === internalValue ? selectedItemRef : undefined}
          className={classname(
            {
              "my-6 shadow-lg": color === internalValue,
              "mb-2 hover:shadow-md": color !== internalValue,
            },
            "w-full h-8 rounded-lg cursor-pointer transition-all duration-200 ease-out"
          )}
          style={{ backgroundColor: color }}
          onClick={() => handleValueSelected(color)}
        />
      )),
    [internalValue, handleValueSelected]
  );

  return (
    <div className="relative flex justify-between items-start">
      {label ? (
        <label htmlFor={name} className="w-full md:w-4/12 py-2">
          {label}
        </label>
      ) : (
        ""
      )}

      <div className="w-full md:w-8/12">
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
        <div
          className="z-50 w-full md:w-8/12 h-52 absolute top-1/2 right-0 shadow-md p-6 bg-white overflow-x-hidden overflow-y-scroll"
          onMouseLeave={closeColorPanel}
          onMouseEnter={cancelCloseColorPanel}
        >
          <ul role="menu" className="w-full">
            {colorListContent}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

ColorPicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  messages: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default ColorPicker;
