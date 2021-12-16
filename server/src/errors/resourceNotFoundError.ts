import BaseError from './baseError';

export default class ResourceNotFoundError extends BaseError {
  public get title(): string {
    return 'The resource requested was not found';
  }
}
