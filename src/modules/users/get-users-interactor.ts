import joi from 'joi';

import { IRequestObject, Interactor, PaginationData } from '../core';
import { MAX_PAGE_SIZE, MIN_PAGE_NUMBER, MIN_PAGE_SIZE } from '../common/pagination';
import { UserGateway } from './user-gateway';
import { logger } from '../../app';

export interface GetUsersRequestObject extends IRequestObject {
    page: number;
    pageSize: number;
}

export const validationSchema = joi.object().keys({
    page: joi
        .number()
        .integer()
        .min(MIN_PAGE_NUMBER)
        .default(MIN_PAGE_NUMBER)
        .optional(),
    pageSize: joi
        .number()
        .integer()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(MIN_PAGE_SIZE)
        .optional(),
});

export class GetUsersInteractor extends Interactor {
    private _userGateway: UserGateway = null;

    setUserGateway(gateway: UserGateway): GetUsersInteractor {
        this._userGateway = gateway;
        return this;
    }

    async execute(request: GetUsersRequestObject) {
        try {

            let result;

            result = await this._userGateway.getUsers(request);

            const pagination = this._buildPaginationData(
                result.count,
                request.pageSize,
                request.page,
            );

            await this.presenter.success(result.rows, pagination);

            return true;
        } catch (error) {
            logger.error('Failed to get users', {
                errorMessage: error.message,
                ...request
            });
            this.presenter.error([error]);

            return false;
        }
    }

    private _buildPaginationData(
        count: number,
        pageSize: number,
        page: number,
    ): PaginationData {
        const totalPages = count > 0 ? Math.ceil(count / pageSize) : 0;

        const paginationData = {
            totalPages: Number(totalPages),
            page,
            pageSize,
        };

        return paginationData;
    }
}
