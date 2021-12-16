import { ErrorObject } from 'ajv';
import BaseError from '../errors/baseError';

export default class ValidationError extends BaseError {
  constructor(public errors: ErrorObject[]) {
    super('Validation error');
  }

  get status(): number {
    return 422;
  }

  get title(): string {
    throw new Error('Request was provided invalid data.');
  }
}
