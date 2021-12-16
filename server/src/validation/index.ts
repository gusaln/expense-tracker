import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const validator = addFormats(new Ajv({strict: 'log'}), [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
])
.addKeyword('kind')
.addKeyword('modifier');

export default validator;