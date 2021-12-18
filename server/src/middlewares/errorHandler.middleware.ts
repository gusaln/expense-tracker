/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseError from "../errors/baseError";
import ResponseFactory from "../response";
import ValidationError from "../validation/validationError";

/* eslint-disable no-unused-vars */
// @ts-ignore
export default function errorHandler(err: Error, _req, res, _next) {
  /* eslint-enable no-unused-vars */

  const runningInDevelopment = process.env.NODE_ENV !== "production";

  if (err instanceof BaseError) {
    res.status(err.status);
  }

  if (runningInDevelopment && err.stack) {
    console.error(err.stack.split("\n"));
  }

  res.json(
    err instanceof ValidationError
      ? ResponseFactory.validationError(err)
      : ResponseFactory.error(err)
  );
}
