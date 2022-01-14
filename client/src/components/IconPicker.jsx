import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import iconsCollection from "../icons";
import { classname, debounce } from "../utils";
import Card from "./Card";
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
    if (selectedRef.current) selectedRef.current.scrollIntoView();
  }, []);

  return (
    <div className="w-[90%] h-[90%] max-h-screen overflow-y-scroll md:w-4/6 md:h-5/6">
      <Card>
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
        <div className="w-full">
          <ul role="menu" className="grid grid-cols-10 gap-1 w-full p-2 overflow-x-hidden sm:gap-2">
            {iconListContent}
          </ul>
        </div>
      </Card>
    </div>
  );
}

const IconPicker = forwardRef((props, ref) => {
  const { name, value = "", onChange = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(null);
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
    (icon) => {
      setValue(icon);
      closePanel();
    },
    [setValue]
  );

  /**
   * @param {Event} ev
   */
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
        <IconPickerPanel
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
          <span className="text-gray-400">Click to pick a icon</span>
        )}
      </div>

      {/* Hidden input connected to the form. */}
      <input hidden id={name} name={name} ref={ref} {...rest} />
    </>
  );
});

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
};

export default IconPicker;
