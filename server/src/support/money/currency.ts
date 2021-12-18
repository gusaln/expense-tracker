import { Big } from "big.js";

/**
 * Represents a currency
 */
export default class Currency {
  private _code: string;

  private _subunit: number;

  /**
   * @param code ISO 4217 code
   * @param subunit currency subunit
   */
  constructor(code: string, subunit = 2) {
    this._code = code.toUpperCase();
    this._subunit = Math.floor(subunit);
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
   */
  eq(other: Currency) {
    return this.code === other.code;
  }

  /**
   * Prepares the object for JSON serialization
   */
  toJSON() {
    return this.code;
  }
}
