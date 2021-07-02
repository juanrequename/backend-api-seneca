import joi from 'joi';
import joiOID from 'joi-oid';

import { IRequestObject, Interactor } from '../core';
import { SessionGateway } from './session-gateway';
import { logger } from '../../app';

export interface GetSessionRequestObject extends IRequestObject {
    courseId: string;
    userId: string;
    sessionId: string;
}

export const validationSchema = joi.object().keys({
    courseId: joiOID
        .objectId()
        .required(),
    sessionId: joi
        .string()
        .required()
});

export class GetSessionInteractor extends Interactor {
    private _sessionGateway: SessionGateway = null;

    setSessionGateway(gateway: SessionGateway): GetSessionInteractor {
        this._sessionGateway = gateway;
        return this;
    }

    async execute(request: GetSessionRequestObject) {
        try {
            let result;

            result = await this._sessionGateway.getSession(request);
            if (!result) {
                throw new Error('session not found');
            }

            await this.presenter.success(result);

            return true;
        } catch (error) {
            logger.error('Failed to get sessions', {
                errorMessage: error.message,
                ...request
            });
            this.presenter.error([error.message]);

            return false;
        }
    }
}
