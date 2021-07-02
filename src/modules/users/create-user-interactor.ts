import { Interactor, IRequestObject } from '../core';
import joi from 'joi';
import { UserGateway } from './user-gateway';
import { User } from './user';
import { logger } from '../../app';

export interface CreateUserRequestObject extends IRequestObject {
    id?: string,
    name: string,
    email: string,
}

export const validationSchema = joi.object().keys({
    name: joi
        .string()
        .required(),
    email: joi
        .string()
        .required(),
});

export class CreateUserInteractor extends Interactor {
    private _userGateway: UserGateway = null;

    setUserGateway(gateway: UserGateway) {
        this._userGateway = gateway;
        return this;
    }


    async execute(request: CreateUserRequestObject) {
        try {
            let user;

            user = User.fromRaw(request);
            const { id: userId } = await this._userGateway.createUser(user);

            const created = await this._userGateway.getUserById({ id: userId.toString() });

            await this.presenter.success(created);

            return true;
        } catch (e) {
            logger.error('Failed to create user', request, e);
            this.presenter.error([e.message]);

            return false;
        }
    }
}
