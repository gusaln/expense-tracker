import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { classname } from "../utils";
import Button from "./Button";
import Card from "./Card";
import DangerButton from "./DangerButton";
import Icon from "./Icon";
import Modal from "./Modal";

type MonthDayValue = (number | string)[];

interface MonthDayPickerPanelProps {
  value: MonthDayValue;
  onClosePanel: () => void;
  onValueSelected: (d: number | string) => void;
  onValueUnselected: (d: number | string) => void;
  onValueAccepted: (ev?: Event) => void;
  onValueCancelled: (ev?: Event) => void;
}

function MonthDayPickerPanel(props: MonthDayPickerPanelProps) {
  const {
    value,
    onClosePanel,
    onValueSelected,
    onValueUnselected,
    onValueAccepted,
    onValueCancelled,
  } = props;

  const monthDaysListContent = useMemo(
    () =>
      Array.from(Array(31))
        .map((_, i) => i + 1)
        .map((monthDay) => {
          const isSelected = value.includes(monthDay);

          return (
            <li
              role="menuitem"
              key={monthDay}
              className={classname(
                {
                  "text-paper bg-charcoal": isSelected,
                  "hover:text-paper": !isSelected,
                },
                "w-8 h-8 inline-flex justify-center items-center rounded-md cursor-pointer transition-all duration-100 hover:bg-gray-500"
              )}
              onClick={
                isSelected ? () => onValueUnselected(monthDay) : () => onValueSelected(monthDay)
              }
            >
              {monthDay}
            </li>
          );
        }),
    [onValueSelected, onValueUnselected, value]
  );

  return (
    <div className="w-[90%] max-h-screen lg:w-2/5">
      <Card>
        <div className="flex justify-end items-center pb-4 space-x-4">
          <div className="h-full flex-grow text-gray-400">Click a day to select/unselect it</div>

          <div className="h-full">
            <DangerButton onClick={onClosePanel}>Close</DangerButton>
          </div>
        </div>

        <div className="w-full">
          <ul role="menu" className="grid grid-cols-7 gap-1 w-full overflow-x-hidden sm:gap-2">
            {monthDaysListContent}
          </ul>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={onValueAccepted}>Accept</Button>
          <Button text onClick={onValueCancelled}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface MonthDayPickerProps {
  name: string;
  value?: string | MonthDayValue;
  placeholder?: string;
  onChange?: (v: MonthDayValue) => void;
  [x: string]: unknown;
}

function getValue(value: string | MonthDayValue) {
  return typeof value == "string" ? [] : value.map((v) => Number(v));
}

const MonthDayPicker = forwardRef((props: MonthDayPickerProps, ref) => {
  const { name, value = [], onChange = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(() => getValue(value));
  const [isOpen, setOpen] = useState(false);

  function closePanel() {
    setOpen(false);
  }

  function openPanel() {
    setOpen(true);
  }

  const handleValueSelected = useCallback(
    (monthDay) => {
      // console.log("MonthDayPicker.handleValueSelected", { internalValue });
      setInternalValue([...internalValue, monthDay].map((d) => Number(d)).sort());
    },
    [setInternalValue, internalValue]
  );

  const handleValueUnselected = useCallback(
    (monthDay) => {
      // console.log("MonthDayPicker.handleValueUnselected", { internalValue });
      setInternalValue(internalValue.map((d) => Number(d)).filter((v) => v != monthDay));
    },
    [setInternalValue, internalValue]
  );

  function handleValueAccepted(ev) {
    ev.stopPropagation();
    onChange?.(internalValue);
    closePanel();
  }

  function handleValueCancelled(ev) {
    ev.stopPropagation();
    setInternalValue(getValue(value));
    closePanel();
  }

  function handleValueClear(ev) {
    ev.stopPropagation();
    onChange?.([]);
    setInternalValue([]);
  }

  useEffect(() => {
    console.log("MonthDayPicker.useEffect", { value});
    setInternalValue(getValue(value));
  }, [value]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closePanel}>
        <MonthDayPickerPanel
          value={internalValue}
          onValueSelected={handleValueSelected}
          onValueUnselected={handleValueUnselected}
          onValueAccepted={handleValueAccepted}
          onValueCancelled={handleValueCancelled}
          onClosePanel={closePanel}
        />
      </Modal>

      {/* This is the input that shows the current value, but it is not connected to the form. */}
      <div
        className="form-input form-input-block flex justify-between items-center"
        onClick={openPanel}
      >
        {internalValue.length ? (
          <>
            <div className="inline-flex h-full -my-2 rounded-lg p-1">{internalValue.join(",")}</div>

            <button
              className="inline-block w-6 h-6 rounded-full bg-charcoal text-paper"
              onClick={handleValueClear}
            >
              <Icon>close</Icon>
            </button>
          </>
        ) : (
          <span className="text-gray-400">Click to select days of the month</span>
        )}
      </div>

      {/* Hidden input connected to the form. */}
      <select
        multiple
        hidden
        id={name}
        name={name}
        value={internalValue.map((s) => String(s))}
        ref={ref as any}
        {...rest}
      />
    </>
  );
});

export default MonthDayPicker;
