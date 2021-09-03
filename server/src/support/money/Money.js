const { Big } = require('big.js');
const Currency = require('./Currency');

/**
 * Represents a monetary quantity.
 *
 * This object is immutable.
 *
 * Operations between currencies (addition and subtraction) are not allowed.
 */
class Money {
  /**
   * @param {Big|number|string} amount
   * @param {Currency|string} currency
   * @param {bool} inSubunit
   */
  constructor(amount, currency, inSubunit = false) {
    if (typeof currency === 'string') {
      currency = new Currency(currency);
    }

    this.currency = currency;
    this.amount = inSubunit
      ? Big(amount)
      : Big(amount).mul(this.currency.scale).round(0, Big.roundDown);
  }

  /**
   * Adds two Money amounts if they are in the same currency.
   *
   * @param {Money} other
   * @returns {Money}
   */
  add(other) {
    if (!this.isSameCurrency(other.currency)) {
      throw new Error('Addition between different currencies is not supported');
    }

    return new Money(this.amount.add(other.amount), this.currency, true);
  }

  /**
   * Substracts two Money amounts if they are in the same currency.
   *
   * @param {Money} other
   * @returns {Money}
   */
  sub(other) {
    if (!this.isSameCurrency(other.currency)) {
      throw new Error('Substraction between different currencies is not supported');
    }

    return new Money(this.amount.sub(other.amount), this.currency, true);
  }

  /**
   * Multiplies the amount of money by n.
   *
   * @param {Big|number} n
   */
  mul(n) {
    return new Money(this.amount.mul(n), this.currency, true);
  }

  /**
   * Divides the amount of money by n.
   *
   * Note that this operation can result in an amount with a decimal part below the subunit for the
   * current currency.
   *
   * @param {Big|number} n
   */
  div(n) {
    return new Money(this.amount.div(n), this.currency, true);
  }

  /**
   * Computes the percentage of the quantity
   *
   * Note that this operation can result in an amount with a decimal part below the subunit for the
   * current currency.
   *
   * @param {Big|number} percentage
   */
  percentage(percentage) {
    return new Money(this.amount.times(percentage).div(100), this.currency, true);
  }

  /**
   * Checks if two Money instances share the same currency.
   *
   * @param {Money} other
   * @returns {Money}
   */
  isSameCurrency(other) {
    return this.currency.eq(other.currency);
  }

  /**
   * Allocates the amount in a given set of parts.
   *
   * @param {number[]} parts
   */
  allocate(parts) {
    const total = parts.reduce((a, b) => Big(a).add(b), Big(0));
    const result = parts.map(() => Big(0));

    let res = Big(this.amount);
    parts.forEach((part, i) => {
      const value = this.amount.mul(part).div(total).round(0, Big.roundDown);
      res = res.sub(value);

      result[i] = value;
    });

    if (!res.eq(0)) {
      let i = 0;
      while (res.gt(0)) {
        result[i] = result[i].add(1);
        res = res.sub(1);
        i += 1;
      }
    }

    return result.map((v) => new Money(v, this.currency, true));
  }

  /**
   * Returns the amount as a string.
   */
  value() {
    return this.amount.div(this.currency.scale).round(this.currency.subunit).toString();
  }

  /**
   * Prepares the object for JSON serialization.
   */
  toJSON() {
    return {
      amount: this.value(),
      currency: this.currency.code
    };
  }
}

module.exports = Money;
