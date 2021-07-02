import { Interactor, IRequestObject } from '../core';
import joi from 'joi';
import joiOID from 'joi-oid';
import { SessionGateway } from './session-gateway';
import { Session } from './session';
import { logger } from '../../app';
import { UserModel } from '../../db/models/user.model';
import { CourseModel } from '../../db/models/course.model';

export interface CreateSessionRequestObject extends IRequestObject {
    id?: string,
    sessionId: string,
    userId: string,
    courseId: string,
    totalModulesStudied: number,
    averageScore: number,
    timeStudied: number
}

export const validationHeaders = joi.object().keys({
    'x-user-id': joiOID
        .objectId()
        .required(),
}).options({ allowUnknown: true });

export const validationSchemaParameter = joi.object().keys({
    courseId: joiOID
        .string()
        .required(),
});

export const validationSchema = joi.object().keys({
    sessionId: joi
        .string()
        .required(),
    totalModulesStudied: joi
        .number()
        .required(),
    averageScore: joi
        .number()
        .required(),
    timeStudied: joi
        .number()
        .required(),
});

export class CreateSessionInteractor extends Interactor {
    private _sessionGateway: SessionGateway = null;

    setSessionGateway(gateway: SessionGateway) {
        this._sessionGateway = gateway;
        return this;
    }


    async execute(request: CreateSessionRequestObject) {
        try {
            let session;

            session = Session.fromRaw(request);

            const user = await UserModel.findById(request.userId);
            if (!user) {
                throw new Error('user not found');
            }
            const course = await CourseModel.findById(request.courseId);
            if (!course) {
                throw new Error('course not found');
            }

            const data = await this._sessionGateway.getSession(request);
            if (data) {
                throw new Error('session id already exist');
            }

            await this._sessionGateway.createSession(session);

            await this.presenter.success('OK');
            return true;
        } catch (e) {
            logger.error('Failed to create session', request, e);
            this.presenter.error([e.message]);

            return false;
        }
    }
}
