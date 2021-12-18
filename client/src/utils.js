import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

/**
 * Tries to parse a date given a wide range of formats.
 *
 * If the date given is null, the function returns null.
 *
 * @param {string|number|Date} date A date string o unix timestamp in milliseconds
 */
export function parseDate(date) {
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

export function parseBool(value) {
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
 * Determines if a date happends in the current month.
 *
 * @param {string|number|Date} date
 *
 * @returns {boolean}
 */
export function isDateThisMonth(date) {
  return parseDate(date).month() === new Date().getMonth();
}

/**
 * @param {string|number|Date} date
 */
export function getStartOfTheMonth(date) {
  return parseDate(date).startOf("month");
}

/**
 * @param {string|number|Date} date
 */
export function getEndOfTheMonth(date) {
  return parseDate(date).endOf("month");
}

/**
 * Generates a class string.
 *
 * @param {Record<string,boolean>} classes
 * @param {string} staticClasses Classes that always apply
 */
export function classname(classes, staticClasses = "") {
  return Object.entries(classes)
    .filter(([, condition]) => condition)
    .map(([className]) => className)
    .concat([staticClasses])
    .join(" ");
}

/**
 * Calculate the brightness of an RGB color
 *
 * @see https://www.w3.org/TR/AERT/#color-contrast
 *
 * @param {string} rgb
 */
export function computeBrightnessFromRGB(rgb) {
  let r;
  let g;
  let b;

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
 *
 * @param {number} lighterColor
 * @param {number} darkerColor
 * @returns
 */
export function computeContrastRatio(lighterColor, darkerColor) {
  return (lighterColor + 0.05) / (darkerColor + 0.05);
}

/**
 * Groups elements from a collection of elements
 *
 * @param {any[]} elements The array of elements.
 * @param {string|(el: any) => any} getter Element attribute or getter function for the key of the
 * groups.
 * @returns {Record<any,any[]>}
 */
export function groupBy(elements, getter) {
  const _getter = typeof getter === "string" ? (el) => el[getter] : getter;

  return elements.reduce((groups, el) => {
    const key = _getter(el);

    if (groups[key]) {
      groups[key].push(el);
    } else {
      groups[key] = [el];
    }

    return groups;
  }, {});
}

/**
 * Creates a map from a collection of elements
 *
 * @param {any[]} elements The array of elements.
 * @param {string|(el: any) => any} getter Element attribute or getter function for the key of the
 * groups.
 * @returns {Record<any,any>}
 */
export function keyBy(elements, getter) {
  const _getter = typeof getter === "string" ? (el) => el[getter] : getter;

  return elements.reduce((groups, el) => {
    const key = _getter(el);
    groups[key] = el;
    return groups;
  }, {});
}

const numberFormatter = Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
});

/**
 * Formats a number according to the current locale
 *
 * @param {number|String} number
 * @returns {String}
 */
export function formatNumber(number) {
  return numberFormatter.format(number);
}

/**
 * @param {Function} fn The function
 * @param {number} delay A delay in ms
 */
export function debounce(fn, delay) {
  let handler = null;

  return function (...args) {
    if (handler) clearTimeout(handler);
    handler = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
