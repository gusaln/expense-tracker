const { Big } = require('big.js');

/**
 * Represents a currency
 */
class Currency {
  /**
   * @param {string} code ISO 4217 code
   * @param {number} subunit currency subunit
   */
  constructor(code, subunit = 2) {
    this._code = code.toUpperCase();
    this._subunit = subunit;
  }

  /**
   * ISO 4217 code
   */
  get code() {
    return this._code;
  }

  /**
   * Currency subunit
   */
  get subunit() {
    return this._subunit;
  }

  /**
   * The power of 10 number that scales an amount to an from the subunit of the currency.
   */
  get scale() {
    return Big(10).pow(this.subunit);
  }

  /**
   * Checks if another Currency object represents the same currency.
   *
   * @param {Currency} other
   */
  eq(other) {
    return this.code === other.code;
  }

  /**
   * Prepares the object for JSON serialization
   */
  toJSON() {
    return this.code;
  }
}

module.exports = Currency;
