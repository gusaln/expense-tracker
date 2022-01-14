import React, { forwardRef } from "react";

interface DateInputProps {
  name: string;
  [x: string]: unknown;
}

const DateInput = forwardRef(({ name, ...rest }: DateInputProps, ref) => {
  return (
    <input className="form-input form-input-block" id={name} name={name} ref={ref as any} {...rest} type="date"/>
  );
});

export default DateInput;
