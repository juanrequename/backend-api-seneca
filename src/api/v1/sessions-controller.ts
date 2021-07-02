import {
    ExpressController,
    ExpressJSONCreatePresenter,
    ExpressJSONPresenter,
} from '../../modules/core';

import { SessionGateway } from '../../modules/sessions/session-gateway';
import { GetSessionsInteractor, GetSessionsRequestObject, validationSchema as getAllSchema } from '../../modules/sessions/get-sessions-interactor';
import { GetSessionInteractor, GetSessionRequestObject, validationSchema as getSessionSchema } from '../../modules/sessions/get-session-interactor';
import {
    CreateSessionInteractor,
    CreateSessionRequestObject, validationHeaders,
    validationSchema as createSchema,
    validationSchemaParameter as createSchemaParams
} from '../../modules/sessions/create-session-interactor';

const USER_HEADER_KEYS = ['x-user-id'];

export class SessionsController extends ExpressController {
    constructor() {
        super();

        this.router.get('/:courseId',
            this.validator.validateCustomHeaders(validationHeaders),
            this.validator.validateParams(getAllSchema),
            this.getSessions.bind(this));

        this.router.get('/:courseId/sessions/:sessionId',
            this.validator.validateCustomHeaders(validationHeaders),
            this.validator.validateParams(getSessionSchema),
            this.getSession.bind(this));

        this.router.post(
            '/:courseId',
            this.validator.validateCustomHeaders(validationHeaders),
            this.validator.validateParams(createSchemaParams),
            this.validator.validateBody(createSchema),
            this.createSession.bind(this)
        );
    }

    async getSessions(req, res, next) {
        const sessionGateway = new SessionGateway();
        const interactor = new GetSessionsInteractor();
        const presenter = new ExpressJSONPresenter(req, res, next);

        const request = req.params as GetSessionsRequestObject;
        request.userId = this._obtainUserFromRequest(req, USER_HEADER_KEYS);

        interactor.setPresenter(presenter).setSessionGateway(sessionGateway);
        await interactor.execute(request);
    }

    async getSession(req, res, next) {
        const sessionGateway = new SessionGateway();
        const interactor = new GetSessionInteractor();
        const presenter = new ExpressJSONPresenter(req, res, next);

        const request = req.params as GetSessionRequestObject;
        request.userId = this._obtainUserFromRequest(req, USER_HEADER_KEYS);

        interactor.setPresenter(presenter).setSessionGateway(sessionGateway);
        await interactor.execute(request);
    }

    async createSession(req, res, next) {
        const sessionGateway = new SessionGateway();
        const interactor = new CreateSessionInteractor();
        const presenter = new ExpressJSONCreatePresenter(req, res, next);

        const request = req.body as CreateSessionRequestObject;

        request.userId = this._obtainUserFromRequest(req, USER_HEADER_KEYS);
        request.courseId = req.params.courseId;

        interactor.setPresenter(presenter).setSessionGateway(sessionGateway);
        await interactor.execute(request);
    }

    private _obtainUserFromRequest(req, headerKeys): string {
        let userId = '';
        if (req.headers) {
            for (const headerKey of headerKeys) {
                if (req.headers[headerKey]) {
                    userId = req.headers[headerKey];
                    break;
                }
            }
        }
        return userId;
    }
}
