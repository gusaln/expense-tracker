import React from "react";
import Datetime from "./Datetime";

export default function DateValue(props) {
  return <Datetime value={props.value} format="YYYY-MM-DD" />;
}
