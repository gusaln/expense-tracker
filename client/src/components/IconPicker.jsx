import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import iconsCollection from "../icons";
import { classname, debounce } from "../utils";

const icons = iconsCollection.filter((icon) => !icon.unsupported_families).map((icon) => icon.name);

const iconTagIndex = iconsCollection.reduce((index, icon) => {
  if (icon.tags)
    icon.tags.forEach((tag) => {
      if (!index[tag]) index[tag] = [];
      index[tag].push(icon.name);
    });

  icon.categories.forEach((c) => {
    if (!index[c]) index[c] = [];
    index[c].push(icon.name);
  });

  if (!index[icon.name]) index[icon.name] = [];
  index[icon.name].push(icon.name);

  return index;
}, {});

/**
 * @param {string} query
 * @returns A list of icons that match the query.
 */
async function searchIcon(query) {
  query = query.toLowerCase();

  return Array.from(
    new Set(
      Object.entries(iconTagIndex)
        .filter(([tag, _]) => tag.indexOf(query) !== -1)
        .flatMap(([_, list]) => list)
    )
  );
}

function IconPickerPanel(props) {
  const { value, onMouseLeavePanel, onMouseEnterPanel, onValueSelected } = props;
  const [iconList, setIconList] = useState(icons);

  const handleSearch = debounce((query) => {
    if (!query || query.length === 0) setIconList(icons);
    else searchIcon(query).then((list) => setIconList(list));
  }, 500);

  const iconListContent = useMemo(
    () =>
      iconList.map((icon) => (
        <li
          id={`icon-${icon}`}
          role="menuitem"
          key={icon}
          className={classname(
            {
              "my-6 shadow-lg": icon === value,
              "mb-2 hover:shadow-md": icon !== value,
            },
            "inline-flex justify-center items-center mr-2 border border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 ease-out"
          )}
          onClick={() => onValueSelected(icon)}
        >
          <span className="material-icons">{icon}</span>
        </li>
      )),
    [iconList, value, onValueSelected]
  );

  return (
    <div
      className="z-50 w-full absolute bottom-0 right-0 md:w-8/12"
      onMouseLeave={onMouseLeavePanel}
      onMouseEnter={onMouseEnterPanel}
    >
      <div
        className="w-full m-2 shadow-md p-6 bg-white"
        style={{ minHeight: "25vh", height: "50vh", maxHeight: "50vh" }}
      >
        <div>
          <input
            className="w-full h-11 mb-2 border rounded p-2 focus:border-2 focus:border-gray-400 hover:border-gray-400"
            placeholder="Search an icon"
            onInput={(ev) => handleSearch(ev.target.value)}
          />
        </div>

        <ul
          role="menu"
          className="w-full min-h-5/6 h-5/6 max-h-full overflow-x-hidden overflow-y-scroll"
        >
          {iconListContent}
        </ul>
      </div>
    </div>
  );
}

function IconPicker(props) {
  const formContext = useFormContext();

  const { name, label, required, messages = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(null);

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
        const el = document.querySelector(`#icon-${internalValue}`);
        if (el) el.scrollIntoView();
      }
    }, 0);
  }

  const handleValueSelected = useCallback(
    (icon) => {
      formContext.setValue(props.name, icon);
    },
    [formContext, props.name]
  );

  /**
   * @param {Event} ev
   */
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
              <div className="inline-flex h-full -my-2 rounded-lg p-1">
                <span className="mr-2">{internalValue}</span>{" "}
                <span className="material-icons">{internalValue}</span>
              </div>

              <button
                className="inline-block w-6 h-6 rounded-full bg-charcoal text-paper"
                onClick={handleValueClear}
              >
                <span className="material-icons">close</span>
              </button>
            </>
          ) : (
            <span className="text-gray-500">Click to pick a icon</span>
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
        <IconPickerPanel
          value={internalValue}
          onValueSelected={handleValueSelected}
          onMouseLeavePanel={closePanel}
          onMouseEnterPanel={cancelClosePanel}
        />
      ) : (
        ""
      )}
    </div>
  );
}

IconPickerPanel.propTypes = {
  value: PropTypes.string,
  onMouseLeavePanel: PropTypes.func,
  onMouseEnterPanel: PropTypes.func,
  onValueSelected: PropTypes.func,
};

IconPicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  messages: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default IconPicker;
