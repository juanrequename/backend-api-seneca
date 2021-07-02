import { IAppContainer } from './application-container';
import { Router } from 'express';
import { IRequestValidator, JoiRequestValidator } from './request-validator';

export interface IHTTPRequestController {
    applicationContainer: IAppContainer;
    router: Router;
    validator: IRequestValidator;
    setApplicationContainer(app: IAppContainer);
    setValidator(validator: IRequestValidator);
}

export class ExpressController implements IHTTPRequestController {
    private static _defaultAppContainer: IAppContainer;
    private _app: IAppContainer = null;
    private _router: Router = null;
    private _validator: IRequestValidator = new JoiRequestValidator();

    static setDefaultAppContainer(app: IAppContainer) {
        this._defaultAppContainer = app;
        return this;
    }

    get applicationContainer() {
        return this._app || ExpressController._defaultAppContainer;
    }

    get router() {
        if (this._router === null) this._router = Router({ mergeParams: true });
        return this._router;
    }

    get validator() {
        return this._validator;
    }

    injectUserInfo(req, res, next) {
        const { currentUser } = req;

        if (currentUser) {
            const { confirmed, email, locale, roles } = currentUser;

            req.userEmail = email && email.toString();
            req.userLocale = locale;
            req.isUserConfirmed = confirmed;
            req.userRoles = roles;
        }

        next();
    }

    setApplicationContainer(app: IAppContainer) {
        this._app = app;
        return this;
    }

    setValidator(validator: IRequestValidator) {
        this._validator = validator;
        return this;
    }
}
