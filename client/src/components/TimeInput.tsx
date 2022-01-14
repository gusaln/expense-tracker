import React, { forwardRef } from "react";

interface TimeInputProps {
  name: string;
  [x: string]: unknown;
}

const TimeInput = forwardRef(({ name, ...rest }: TimeInputProps, ref) => {
  return (
    <input className="form-input form-input-block" id={name} name={name} ref={ref} {...rest} type="time"/>
  );
});

export default TimeInput;
