import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import RRule, { Frequency, Weekday, WeekdayStr } from "rrule";

dayjs.extend(customParseFormat);

export const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

/**
 * Tries to parse a date given a wide range of formats.
 *
 * If the date given is null, the function returns null.
 *
 * @param date A date string o unix timestamp in milliseconds
 */
export function parseDate(date: string | number | Date | null) {
  if (!date) {
    return null;
  }

  if (dayjs.isDayjs(date)) {
    return date.clone();
  }

  if (date instanceof Date || typeof date === "number" || !Number.isNaN(parseInt(date, 10))) {
    return dayjs(date);
  }

  return dayjs(date, [
    // ISO
    "YYYY-MM-DDTHH:mm:ss.SSSZZ",
    "YYYY-MM-DDTHH:mm:ssZ",
    "YYYY-MM-DDTHH:mm:ss.SSZZ",
    "YYYY-MM-DDTHH:mm:ss.SZZ",
    "YYYY-MM-DDTHH:mm:ssZZ",
    "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "YYYY-MM-DDTHH:mm:ss.SSZ",
    "YYYY-MM-DDTHH:mm:ss.SZ",
    "YYYY-MM-DDTHH:mm:ssZ",
    "YYYY-MM-DDTHH:mm:ss.SSS",
    "YYYY-MM-DDTHH:mm:ss.SS",
    "YYYY-MM-DDTHH:mm:ss.S",
    "YYYY-MM-DDTHH:mm:ss",
    // ISO like
    "YYYY-MM-DD HH:mm:ss.SSSZZ",
    "YYYY-MM-DD HH:mm:ss.SSZZ",
    "YYYY-MM-DD HH:mm:ss.SZZ",
    "YYYY-MM-DD HH:mm:ssZZ",
    "YYYY-MM-DD HH:mm:ss.SSSZ",
    "YYYY-MM-DD HH:mm:ss.SSZ",
    "YYYY-MM-DD HH:mm:ss.SZ",
    "YYYY-MM-DD HH:mm:ssZ",
    "YYYY-MM-DD HH:mm:ss.SSS",
    "YYYY-MM-DD HH:mm:ss.SS",
    "YYYY-MM-DD HH:mm:ss.S",
    "YYYY-MM-DD HH:mm:ss",
    // Only date
    "YYYY-MM-DD",
  ]);
}

export function parseBool(value: string | number) {
  switch (typeof value) {
    case "boolean":
      return value;

    case "number":
      return value === 1;

    case "string":
      return ["true", "on", "yes", "1"].includes(value);

    default:
      return true;
  }
}

/**
 * Determines if a date happens in the current month.
 */
export function isDateThisMonth(date: string | number | Date): boolean {
  return parseDate(date).month() === new Date().getMonth();
}

export function getStartOfTheMonth(date: string | number | Date) {
  return parseDate(date).startOf("month");
}

export function getEndOfTheMonth(date: string | number | Date) {
  return parseDate(date).endOf("month");
}

/**
 * Generates a class string.
 *
 * @param classes
 * @param staticClasses Classes that always apply
 */
export function classname(classes: Record<string, boolean>, staticClasses = "") {
  return Object.entries(classes)
    .filter(([, condition]) => condition)
    .map(([className]) => className)
    .concat([staticClasses])
    .join(" ");
}

/**
 * Calculates the brightness of an RGB color
 *
 * @see https://www.w3.org/TR/AERT/#color-contrast
 */
export function computeBrightnessFromRGB(rgb: string) {
  let r: number;
  let g: number;
  let b: number;

  const rbgNumber = parseInt(rgb.slice(1), 16);
  if (rgb.length === 4) {
    r = (rbgNumber >> 4) & 0xf;
    g = (rbgNumber >> 2) & 0xf;
    b = (rbgNumber >> 0) & 0xf;

    r = (255 * r) / 15;
    g = (255 * g) / 15;
    b = (255 * b) / 15;
  } else {
    r = (rbgNumber >> 16) & 0xff;
    g = (rbgNumber >> 8) & 0xff;
    b = (rbgNumber >> 0) & 0xff;
  }

  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Computes the contrast ratio of two colors.
 *
 * @see https://www.w3.org/TR/WCAG/#dfn-contrast-ratio
 */
export function computeContrastRatio(lighterColor: number, darkerColor: number): number {
  return (lighterColor + 0.05) / (darkerColor + 0.05);
}

/**
 * Checks if a color is light
 *
 * @param color
 * @param offset allows to skew the selection by moving the target brightness up or down (between -125 and 125)
 */
export function isDarkColor(color: string, offset = 0) {
  // https://www.w3.org/TR/AERT/#color-contrast suggests a maximum brightness difference of 125.
  // Since the brightness of black is 0, the brightness of any color is its difference with black.
  return computeBrightnessFromRGB(color) < Math.max(0, 125 + offset);
}

type GetterFn<T> = (el: T) => string;
type Getter<T> = keyof T | GetterFn<T>;

type Element = object;

const createGetter = <T>(getter: Getter<T>) =>
  typeof getter === "function" ? getter : (el: T) => String(el[getter]);

/**
 * Groups elements from a collection of elements
 *
 * @param elements The array of elements.
 * @param getter Element attribute or getter function for the key of the
 *  groups.
 */
export function groupBy<T extends Element>(elements: T[], getter: Getter<T>) {
  const _getter = createGetter(getter);

  return elements.reduce((groups, el) => {
    const key = _getter(el);

    if (groups[key]) {
      groups[key].push(el);
    } else {
      groups[key] = [el];
    }

    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Creates a map from a collection of elements
 *
 * @param elements The array of elements.
 * @param getter Element attribute or getter function for the key.
 */
export function keyBy<T extends Element>(elements: T[], getter: Getter<T>) {
  const _getter = createGetter(getter);

  return elements.reduce((groups, el) => {
    const key = _getter(el);
    groups[key] = el;
    return groups;
  }, {} as Record<string, T>);
}

const numberFormatter = Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
});

/**
 * Formats a number according to the current locale
 */
export function formatNumber(number: number | bigint): string {
  return numberFormatter.format(number);
}

/**
 * @param fn The function
 * @param delay A delay in ms
 */
export function debounce<T extends (...args: any) => any>(fn: T, delay: number) {
  let handler = null;

  return function (...args: Parameters<typeof fn>) {
    if (handler) clearTimeout(handler);
    handler = setTimeout(() => {
      fn(...(args as any));
    }, delay);
  };
}
