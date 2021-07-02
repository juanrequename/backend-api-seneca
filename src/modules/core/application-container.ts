import { ProcessSignal } from '../common';
import { Express, Router, RequestHandler } from 'express';
import { Server } from 'http';
// import { TokenAuthenticator } from './token-auth';

export interface IAppContainer {
    app: Express;
    router: Router;
    server: Server;
    models;
    // tokenAuth: TokenAuthenticator;
    setApp(app: Express);
    setModels(models);
    start(port: number | string);
    shutdown(signal: ProcessSignal);
}

export class ApplicationContainer implements IAppContainer {
    private _expressApp: Express;
    private _httpServer: Server;
    private _models;
    // private _tokenAuth: TokenAuthenticator;
    private readonly _router: Router = Router();

    get app() {
        return this._expressApp;
    }

    /** Core router */
    get router() {
        return this._router;
    }

    get server() {
        return this._httpServer;
    }

    get models() {
        return this._models;
    }

    // get tokenAuth() {
    //     return this._tokenAuth;
    // }
    //
    // setTokenAuthenticator(value: TokenAuthenticator) {
    //     this._tokenAuth = value;
    //     return this;
    // }

    setModels(modelContainer) {
        this._models = modelContainer;
        return this;
    }

    setApp(app: Express) {
        this._expressApp = app;
        return this;
    }

    useRouter(path: string | Router, router?: Router) {
        this._router.use(...arguments);
        return this;
    }

    /** Register middleware before the any router will be attached */
    useMiddleware(path: string | RequestHandler, middleware?: RequestHandler) {
        this._expressApp.use(...arguments);
        return this;
    }

    usePostMiddleware(path: string, middleware: RequestHandler){
        this._expressApp.post(path, middleware);
        return this;
    }

    async start(port: number | string) {
        this._expressApp.use(this._router);
        this._httpServer = this._expressApp.listen(port);
        // logger.info('Application is listening on %s', port);
    }

    async shutdown(signal: ProcessSignal) {
        this._httpServer && this._httpServer.close();
        // logger.info('Application is closed by signal %s', signal);
    }
}
