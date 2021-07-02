import { Schema, ValidationOptions } from 'joi';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpStatus } from '../common';

const STRICT_VALIDATION = false;

/**
 * An set of validation middlewares
 */
export interface IRequestValidator {
    validateQuery(...params: any): RequestHandler;
    validateBody(...params: any): RequestHandler;
    validateParams(...params: any): RequestHandler;
    validateCustomHeaders(...params: any): RequestHandler;
}

/** Joi request validation helper */
export class JoiRequestValidator implements IRequestValidator {
    private readonly _defaultValidationOptions: ValidationOptions = {
        abortEarly: false,
        allowUnknown: !STRICT_VALIDATION,
    };

    validateQuery(schema: Schema, options = this._defaultValidationOptions) {
        return (req: Request, res: Response, next: NextFunction) => {
            const params = req.query;
            const { validated, errors } = this._validateRequest(params, schema, options);
            if (errors){
                // logger.warn('Query validation failed', {
                //     ...errors,
                //     url: req.url,
                //     code: 400,
                //     // @ts-ignore
                //     userEmail: req.userEmail
                // });
                return res.status(HttpStatus.BAD_REQUEST).json({ errors });
            }
            const raw = req.query;
            // Store original unvalidaed values to query object
            req.query = { ...validated, raw };
            return next();
        };
    }

    validateBody(schema: Schema, options = this._defaultValidationOptions) {
        return (req: Request, res: Response, next: NextFunction) => {
            const params = req.body;
            const { validated, errors } = this._validateRequest(params, schema, options);
            if (errors){
                // logger.warn('Body validation failed', {
                //     ...errors,
                //     url: req.url,
                //     code: 400,
                //     // @ts-ignore
                //     userEmail: req.userEmail
                // });
                return res.status(HttpStatus.BAD_REQUEST).json({ errors });
            }
            const raw = req.body;
            // Store original unvalidaed values to body object
            req.body = { ...validated, raw };
            return next();
        };
    }

    validateParams(schema: Schema, options = this._defaultValidationOptions) {
        return (req: Request, res: Response, next: NextFunction) => {
            const params = req.params;
            const { validated, errors } = this._validateRequest(params, schema, options);
            if (errors){
                // logger.warn('Params validation failed', {
                //     ...errors,
                //     url: req.url,
                //     code: 400,
                //     // @ts-ignore
                //     userEmail: req.userEmail
                // });
                return res.status(HttpStatus.BAD_REQUEST).json({ errors });
            }
            const raw = req.params;
            // Store original unvalidaed values to params object
            req.params = { ...validated, raw };
            return next();
        };
    }

    private _validateRequest(params, schema, options) {
        const validationResult = schema.validate(params, options);
        if (!validationResult.error) {
            return { validated: validationResult.value };
        }
        const errors = validationResult.error.isJoi
            ? validationResult.error.details
            : [{ message: validationResult.error.message }];
        return { errors };
    }

    validateCustomHeaders(schema: Schema, options = this._defaultValidationOptions) {
        return (req: Request, res: Response, next: NextFunction) => {
            const params = req.headers;
            const { validated, errors } = this._validateRequest(params, schema, options);
            if (errors){
                // logger.warn('Params validation failed', {
                //     ...errors,
                //     url: req.url,
                //     code: 400,
                //     // @ts-ignore
                //     userEmail: req.userEmail
                // });
                return res.status(HttpStatus.BAD_REQUEST).json({ errors });
            }
            const raw = req.headers;
            // Store original unvalidaed values to headers object
            req.headers = { ...validated, raw };
            return next();
        };
    }
}
