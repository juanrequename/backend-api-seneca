import joi from 'joi';
import joiOID from 'joi-oid';

import { IRequestObject, Interactor } from '../core';
import { SessionGateway } from './session-gateway';
import { logger } from '../../app';

export interface GetSessionsRequestObject extends IRequestObject {
    courseId: string;
    userId: string;
}

export const validationSchema = joi.object().keys({
    courseId: joiOID
        .objectId()
        .required(),
});

export class GetSessionsInteractor extends Interactor {
    private _sessionGateway: SessionGateway = null;

    setSessionGateway(gateway: SessionGateway): GetSessionsInteractor {
        this._sessionGateway = gateway;
        return this;
    }

    async execute(request: GetSessionsRequestObject) {
        try {
            let result;

            result = await this._sessionGateway.getSessions(request);

            await this.presenter.success(result);

            return true;
        } catch (error) {
            logger.error('Failed to get sessions', {
                errorMessage: error.message,
                ...request
            });
            this.presenter.error([error]);

            return false;
        }
    }
}
