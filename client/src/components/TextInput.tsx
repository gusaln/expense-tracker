import React, { forwardRef } from "react";

interface TextInputProps {
  name: string;
  [x: string]: unknown;
}

const TextInput = forwardRef(({ name, ...rest }: TextInputProps, ref) => {
  return (
    <input className="form-input form-input-block" id={name} name={name} ref={ref} {...rest} />
  );
});

export default TextInput;
