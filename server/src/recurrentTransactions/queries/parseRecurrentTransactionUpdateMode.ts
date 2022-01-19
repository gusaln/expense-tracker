import {
  RecurrentTransactionUpdateMode,
  RecurrentTransactionUpdateModeKeys
} from "../types";

export default function parseRecurrentTransactionUpdateMode(mode: RecurrentTransactionUpdateModeKeys): RecurrentTransactionUpdateMode {
  return (
    {
      single: RecurrentTransactionUpdateMode.SINGLE,
      all_in_series_before: RecurrentTransactionUpdateMode.ALL_IN_SERIES_BEFORE,
      all_in_series: RecurrentTransactionUpdateMode.ALL_IN_SERIES,
    } as Record<RecurrentTransactionUpdateModeKeys, RecurrentTransactionUpdateMode>
  )[mode];
}
