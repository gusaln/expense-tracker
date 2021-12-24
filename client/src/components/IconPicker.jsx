import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import iconsCollection from "../icons";
import { classname, debounce } from "../utils";
import DangerButton from "./DangerButton";
import Icon from "./Icon";
import Modal from "./Modal";

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
  const { value, onClosePanel, onValueSelected } = props;
  const [iconList, setIconList] = useState(icons);

  const handleSearch = debounce((query) => {
    if (!query || query.length === 0) setIconList(icons);
    else searchIcon(query).then((list) => setIconList(list));
  }, 500);

  const selectedRef = useRef(null);

  const iconListContent = useMemo(
    () =>
      iconList.map((icon) => (
        <li
          ref={icon === value ? selectedRef : undefined}
          role="menuitem"
          key={icon}
          className={classname(
            {
              "shadow-xl outline outline-6": icon === value,
              "shadow-sm hover:outline hover:outline-6": icon !== value,
            },
            "inline-flex justify-center items-center mr-2 outline-blue-500 border border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200"
          )}
          onClick={() => onValueSelected(icon)}
        >
          <Icon>{icon}</Icon>
        </li>
      )),
    [iconList, value, onValueSelected]
  );

  useEffect(() => {
    // setTimeout(() => {
      if (selectedRef.current) selectedRef.current.scrollIntoView();
    // }, 0);
  }, []);

  return (
    <div className="w-[90%] h-[90%] max-h-screen shadow-md p-4 bg-white overflow-y-clip md:w-4/6 md:h-5/6">
      <div className="flex justify-end items-center pb-4 space-x-4">
        <div className="form-input form-input-block flex flex-grow space-x-2">
          <Icon>search</Icon>

          <input
            className="flex-grow"
            placeholder="Type to filter icons"
            onInput={(ev) => handleSearch(ev.target.value)}
          />
        </div>

        <div className="h-11">
          <DangerButton onClick={onClosePanel}>Close</DangerButton>
        </div>
      </div>

      <div className="w-full max-h-[90%] overflow-y-scroll">
        <ul role="menu" className="grid grid-cols-10 gap-1 w-full p-2 overflow-x-hidden sm:gap-2">
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

  function closePanel() {
    setOpen(false);
  }

  function handleOpenPanel() {
    setOpen(true);
  }

  const handleValueSelected = useCallback(
    (icon) => {
      formContext.setValue(props.name, icon);
      closePanel();
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
          className="form-input form-input-block flex justify-between items-center"
          onClick={handleOpenPanel}
        >
          {internalValue ? (
            <>
              <div className="inline-flex h-full -my-2 rounded-lg p-1">
                <span className="mr-2">{internalValue}</span> <Icon>{internalValue}</Icon>
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

      <Modal isOpen={isOpen} onClose={closePanel}>
        <IconPickerPanel
          value={internalValue}
          onValueSelected={handleValueSelected}
          onClosePanel={closePanel}
        />
      </Modal>
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
