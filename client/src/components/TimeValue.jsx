import React from 'react'
import Datetime from './Datetime';

export default function TimeValue(props) {
  return <Datetime value={props.value} format="hh:mm:ss a" />;
}