// import { ValidationResult } from 'fastify';
// import { FastifyError } from 'fastify-error';
import { ErrorObject } from "ajv";
import BaseError from "./errors/baseError";
import ValidationError from "./validation/validationError";

export interface DataResponse<T = unknown> {
  data: T;
}

export interface ErrorResponse {
  errors: ErrorPayload[];
}

/** @see https://jsonapi.org/format/#errors */
interface ErrorPayload {
  title: string;
  detail: string;
  status?: string;
  source?: {
    /** A JSON Pointer [RFC6901](https://datatracker.ietf.org/doc/html/rfc6901) */
    pointer?: string;
    parameter?: string;
  };
  meta?: Record<string, unknown>;
}

interface ValidationErrorObject extends ErrorPayload {
  status: "422";
  meta?: {
    /**
     * The condition that was satisfied.
     *
     * Ex: maxLenth, minLenth, etc.
     */
    rule: string;
    /**
     * The parameters for the condition.
     *
     * Ex: In case of maxLenth or minLenth, the `limit`
     */
    params: Record<string, unknown>;
    /**
     * The URI of the schema rule.
     */
    schemaPath: string;
  };
}

/** @see https://jsonapi.org/format */
export type Response = DataResponse | ErrorResponse;

function mapValidationResult(result: ErrorObject): ValidationErrorObject {
  return {
    title: "Validation error",
    detail: result.message || "The data provided was invalid",
    status: "422",
    source: {
      pointer: result.instancePath,
    },
    meta: {
      rule: result.keyword,
      schemaPath: result.schemaPath,
      params: result.params,
    },
  };
}

function createValidationErrorResponse(err: ValidationError): Response {
  return {
    errors: err.errors.map(mapValidationResult),
  };
}

function createErrorResponse(err: Error): Response {
  if (err instanceof BaseError) {
    return {
      errors: [
        {
          title: err.title,
          detail: err.message,
          status: String(err.status),
        },
      ],
    };
  }

  return {
    errors: [
      {
        title: "An error ocurred",
        detail: err.message,
        status: "500",
      },
    ],
  };
}

const ResponseFactory = {
  error: createErrorResponse,
  validationError: createValidationErrorResponse,
};

export default ResponseFactory;
