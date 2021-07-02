import { UserModel, } from '../../db/models/user.model';

import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE } from '../common/pagination';
import { MongoGateway } from '../common/persistance-gateway';
import { User } from './user';
import { logger } from '../../app';

interface GetUsersParameters {
    page: number;
    pageSize: number;
}

interface GetUserByIdParameters {
    id: string;
}

interface GetUsersResult {
    count: number;
    rows: any;
}

export class UserGateway extends MongoGateway {
    private _userModel = UserModel;

    setUserModel(model: typeof UserModel) {
        this._userModel = model;
        return this;
    }

    async getUsers({
                          page = DEFAULT_PAGE_NUM,
                          pageSize = DEFAULT_PAGE_SIZE,
                      }: GetUsersParameters): Promise<GetUsersResult> {

        const query: any = {};

        const rows = await this._userModel.find(query)
            .sort({ createdAt: 'descending' })
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const count = await this._userModel.count(query);

        return {
            count,
            rows,
        };
    }

    async createUser(user: User): Promise<User> {
        logger.debug('Creating user... UserEmail: %s', user.authorEmail);

        const modelValues = {
            ...user.toModelValues(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const created = await this._userModel.create(modelValues);

        return User.fromRaw(created);
    }

    async getUserById({ id }: GetUserByIdParameters) {
        const query = {
            _id: id,
        };
        return UserModel.findOne(query).exec();
    }
}
