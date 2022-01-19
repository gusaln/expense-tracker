import RRule, { Frequency, Weekday, WeekdayStr } from "rrule";

export function parseFrequency(freq: keyof typeof Frequency): Frequency {
  return {
    SECONDLY: Frequency.SECONDLY,
    MINUTELY: Frequency.MINUTELY,
    HOURLY: Frequency.HOURLY,
    DAILY: Frequency.DAILY,
    WEEKLY: Frequency.WEEKLY,
    MONTHLY: Frequency.MONTHLY,
    YEARLY: Frequency.YEARLY,
  }[freq];
}

export function parseWeekday(weekday?: WeekdayStr): Weekday | undefined {
  if (!weekday) return weekday as any;

  return {
    MO: RRule.MO,
    TU: RRule.TU,
    WE: RRule.WE,
    TH: RRule.TH,
    FR: RRule.FR,
    SA: RRule.SA,
    SU: RRule.SU,
  }[weekday];
}

/**
 * Returns an array if it is not empty and `undefined` otherwise.
 */
export function passUndefinedIfNotFilled<T>(arr?: T[]): T[] | undefined {
  return arr && arr.length ? arr : undefined;
}

/**
 * Get the text representation of a recurrence.
 */
export function getRecurrenceText(data: Record<string, unknown>): string | undefined {
  try {
    return new RRule({
      freq: parseFrequency(data.recur_freq as any),
      interval: Number(data.recur_interval),
      // wkst: parseWeekday(data.recur_wkst),
      // dtstart: parseDate(data.recur_date + " " + data.recur_time).toDate(),
      bymonth: passUndefinedIfNotFilled(
        (data.recur_bymonth as any[] | undefined)?.map((d) => Number(d))
      ),
      // byweekno: data.recur_byweekno?.map((d) => Number(d)),
      // byyearday: data.recur_byyearday?.map((d) => Number(d)),
      bymonthday: passUndefinedIfNotFilled(
        (data.recur_bymonthday as any[] | undefined)?.map((d) => Number(d))
      ),
      // byweekday: data.recur_byday,
      // byhour: data.recur_byhour?.map((d) => Number(d)),
      // byminute: data.recur_byminute?.map((d) => Number(d)),
      // bysecond: data.recur_bysecond?.map((d) => Number(d)),
      // bysetpos: data.recur_bysetpos?.map((d) => Number(d)),
      // until: data.recur_until,
      // count: Number(data.recur_count),
    }).toText();
  } catch (error) {
    return undefined;
  }
}