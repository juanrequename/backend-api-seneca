import { ExpressController, ExpressJSONSearchPresenter, ExpressJSONCreatePresenter, /*ExpressJSONShowPresenter */ } from '../../modules/core';

import { UserGateway } from '../../modules/users/user-gateway';
import { GetUsersInteractor, GetUsersRequestObject, validationSchema as getAllSchema } from '../../modules/users/get-users-interactor';
import { CreateUserRequestObject, validationSchema as createSchema } from '../../modules/users/create-user-interactor';
import { CreateUserInteractor } from '../../modules/users/create-user-interactor';

export class UsersController extends ExpressController {
    constructor() {
        super();

        this.router.get('/', this.validator.validateQuery(getAllSchema), this.getUsers.bind(this));

        this.router.post('/', this.validator.validateBody(createSchema), this.createUser.bind(this));
    }

    async getUsers(req, res, next) {
        const userGateway = new UserGateway();
        const interactor = new GetUsersInteractor();

        const presenter = new ExpressJSONSearchPresenter(req, res, next);

        const request = req.query as GetUsersRequestObject;

        interactor.setPresenter(presenter).setUserGateway(userGateway);
        await interactor.execute(request);
    }

    async createUser(req, res, next) {
        const userGateway = new UserGateway();
        const interactor = new CreateUserInteractor();
        const presenter = new ExpressJSONCreatePresenter(req, res, next);

        const request = req.body as CreateUserRequestObject;

        interactor.setPresenter(presenter).setUserGateway(userGateway);

        await interactor.execute(request);
    }
}
