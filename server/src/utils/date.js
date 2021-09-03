const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

const DATE_DB_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSZZ';

/**
 * Tries to parse a date given a wide range of formats.
 *
 * If the date given is null, the function returns null.
 *
 * @param {string|number} date A date string o unix timestamp in milliseconds
 */
function parseDate(date) {
  if (!date) {
    return null;
  }

  if (date instanceof Date || typeof date === 'number' || !Number.isNaN(parseInt(date, 10))) {
    return dayjs(date);
  }

  return dayjs(date, [
    'YYYY-MM-DD HH:mm:ss.SSSZZ',
    'YYYY-MM-DD HH:mm:ss.SSZZ',
    'YYYY-MM-DD HH:mm:ss.SZZ',
    'YYYY-MM-DD HH:mm:ssZZ',
    'YYYY-MM-DD HH:mm:ss.SSSZ',
    'YYYY-MM-DD HH:mm:ss.SSZ',
    'YYYY-MM-DD HH:mm:ss.SZ',
    'YYYY-MM-DD HH:mm:ssZ',
    'YYYY-MM-DD HH:mm:ss.SSS',
    'YYYY-MM-DD HH:mm:ss.SS',
    'YYYY-MM-DD HH:mm:ss.S',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD',
  ]);
}

module.exports = {
  DATE_DB_FORMAT,
  dateHelper: dayjs,
  parseDate
};
