import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { classname } from "../utils";
import Button from "./Button";
import Card from "./Card";
import DangerButton from "./DangerButton";
import Icon from "./Icon";
import Modal from "./Modal";

type MonthValue = (number | string)[];

interface MonthPickerPanelProps {
  value: MonthValue;
  onClosePanel: () => void;
  onValueSelected: (d: number | string) => void;
  onValueUnselected: (d: number | string) => void;
  onValueAccepted: (ev?: Event) => void;
  onValueCancelled: (ev?: Event) => void;
}

const MONTH_MAP = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function MonthPickerPanel(props: MonthPickerPanelProps) {
  const {
    value,
    onClosePanel,
    onValueSelected,
    onValueUnselected,
    onValueAccepted,
    onValueCancelled,
  } = props;

  const monthsListContent = useMemo(
    () =>
      Array.from(Array(12))
        .map((_, i) => i + 1)
        .map((month) => {
          const isSelected = value.includes(month);

          return (
            <li
              role="menuitem"
              key={month}
              className={classname(
                {
                  "text-paper bg-charcoal": isSelected,
                  "hover:text-paper": !isSelected,
                },
                "w-16 h-10 inline-flex justify-center items-center rounded-md cursor-pointer transition-all duration-100 hover:bg-gray-500"
              )}
              onClick={isSelected ? () => onValueUnselected(month) : () => onValueSelected(month)}
            >
              {month} {MONTH_MAP[month]}
            </li>
          );
        }),
    [onValueSelected, onValueUnselected, value]
  );

  return (
    <div className="w-[90%] max-h-screen lg:w-2/5">
      <Card>
        <div className="flex justify-end items-center pb-4 space-x-4">
          <div className="h-full flex-grow text-gray-400">Click a month to select/unselect it</div>

          <div className="h-full">
            <DangerButton onClick={onClosePanel}>Close</DangerButton>
          </div>
        </div>

        <div className="w-full">
          <ul role="menu" className="grid grid-cols-4 gap-1 w-full overflow-x-hidden sm:gap-2">
            {monthsListContent}
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

interface MonthPickerProps {
  name: string;
  value?: string | MonthValue;
  placeholder?: string;
  onChange?: (v: MonthValue) => void;
  [x: string]: unknown;
}

const MonthPicker = forwardRef((props: MonthPickerProps, ref) => {
  const { name, value = [], onChange = null, ...rest } = props;

  const [internalValue, setInternalValue] = useState(() => (typeof value == "string" ? [] : value));
  const [isOpen, setOpen] = useState(false);

  function closePanel() {
    setOpen(false);
  }

  function openPanel() {
    setOpen(true);
  }

  const handleValueSelected = useCallback(
    (month) => {
      // console.log("MonthPicker.handleValueSelected", { internalValue });
      setInternalValue([...internalValue, month].map((d) => Number(d)).sort());
    },
    [setInternalValue, internalValue]
  );

  const handleValueUnselected = useCallback(
    (month) => {
      // console.log("MonthPicker.handleValueUnselected", { internalValue });
      setInternalValue(internalValue.map((d) => Number(d)).filter((v) => v != month));
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
    setInternalValue(typeof value == "string" ? [] : value);
    closePanel();
  }

  function handleValueClear(ev) {
    ev.stopPropagation();
    onChange?.([]);
    setInternalValue([]);
  }

  useEffect(() => {
    // console.log("MonthPicker.useEffect", { value, internalValue });
    setInternalValue(typeof value == "string" ? [] : value);
  }, [value]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closePanel}>
        <MonthPickerPanel
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
          <span className="text-gray-400">Click to select months</span>
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

export default MonthPicker;
