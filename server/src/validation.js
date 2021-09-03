const { Joi } = require('express-validation');

/**
 * @type {Joi} validator
 */
const validator = Joi.extend({
  type: 'color',
  base: Joi.string(),
  messages: {
    'color.base': '{{#label}} must be in either format #000 or #000000',
  },
  validate(value, helpers) {
    if (!/[#]([0-9a-f]{3}|[0-9a-f]{6})/i.test(value)) {
      return { value, errors: helpers.error('color.base') };
    }

    return { value };
  }
});

module.exports = {
  validator
};
