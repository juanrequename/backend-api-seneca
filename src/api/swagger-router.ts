import express from 'express';
import path from 'path';


export class SwaggerRouter {
    tokenAuth;

    constructor({ tokenAuth }) {
        this.tokenAuth = tokenAuth;
    }

    build() {
        const router = express.Router();

        // router.use(this.tokenAuth.hasAdminIP());
        router.use('/api', express.static(path.join(__dirname, '../templates/api-docs/swagger-ui.html')));
        router.use('/swagger.yaml', express.static(path.join(__dirname, '../templates/api-docs/swagger.yaml')));

        return router;
    }
}
