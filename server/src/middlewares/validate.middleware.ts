import { Static, TObject, TProperties, TSchema, Type } from '@sinclair/typebox';
import { RequestHandler as ExpressRequestHandler } from 'express';
import validator from '../validation';
import ValidationError from '../validation/validationError';

interface HandlerSchema<T extends { Body?: TProperties, Query?: TProperties, Params?: TProperties } = any> {
  body?: T['Body'] extends TProperties ? TObject<T['Body']> : never,
  query?: T['Query'] extends TProperties ? TObject<T['Query']> : never,
  params?: T['Params'] extends TProperties ? TObject<T['Params']> : never,
}

type TypeOfSchema<T extends TSchema | undefined, TElse = any> = T extends TSchema ? Static<T> : TElse;

type RequestHandler<
  TSchema extends HandlerSchema,
  P = TypeOfSchema<TSchema['params'], any>,
  ResBody = any,
  ReqBody = TypeOfSchema<TSchema['body']>,
  ReqQuery = TypeOfSchema<TSchema['query'], qs.ParsedQs>,
  Locals extends Record<string, any> = Record<string, any>
  > = ExpressRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>

let lastId = 1;
const generateId = () => '' + lastId++;

/**
 * Creates a request handler that validates the request using a schema
 */
export default function validate<T extends HandlerSchema>(schema: T): RequestHandler<T> {
  const id = generateId();
  validator.addSchema(Type.Object(schema as unknown as TProperties), id);

  return async (req, _res, next) => {
    const validate = validator.getSchema<T>(id);

    // console.log('Validating', {
    //   body: req.body,
    //   query: req.query,
    //   params: req.params,
    //   headers: req.headers,
    // });

    if (validate && !validate(req)) {
      next(new ValidationError(validate.errors || []));
    }

    next();
  };
}
