import React from 'react'
import { parseDate } from '../utils'

const format = (date, format) => {
  return parseDate(date).format(format)
}

export default function Datetime(props) {
  return (
    <>
      {format(props.value, props.format || 'YYYY-MM-DDTHH:mm:sszz')}
    </>
  )
}
