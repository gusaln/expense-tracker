import BaseError from "./baseError";

export default class ApiError extends BaseError {
  private _status: number;

  constructor(message: string, status = 400) {
    super(message);
    this._status = status;
  }

  get status(): number {
    return this._status;
  }

  get title(): string {
    return this.message;
  }
}
