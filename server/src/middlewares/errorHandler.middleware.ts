/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Response } from "express";
import BaseError from "../errors/baseError";
import ResponseFactory from "../response";
import ValidationError from "../validation/validationError";

// @ts-ignore
export default function errorHandler(err: Error, _req, res: Response, _next) {
  const runningInDevelopment = process.env.NODE_ENV !== "production";

  if (runningInDevelopment && err.stack) {
    console.error(err.stack.split("\n"));
  }

  res
    .status(err instanceof BaseError ? err.status : 500)
    .json(
      err instanceof ValidationError
        ? ResponseFactory.validationError(err)
        : ResponseFactory.error(err)
    );
}
