import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError";

/**
 * Shows a not found response
 */
export default function notFoundHandler(req: Request, _: Response, next: NextFunction) {
  next(new ApiError(`Not Found - ${req.originalUrl}`, 404));
}
