import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    return next();
  };
}
