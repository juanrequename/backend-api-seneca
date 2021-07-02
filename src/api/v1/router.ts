import { Router } from 'express';
import { SessionsController } from './sessions-controller';
import { UsersController } from './users-controller';
import { CoursesController } from './courses-controller';

export class ApiRouter {
    tokenAuth;

    constructor({ tokenAuth }) {
        this.tokenAuth = tokenAuth;
    }

    build() {
        const router = Router();

        const usersController = new UsersController();
        const sessionsController = new SessionsController();
        const coursesController = new CoursesController()

        router.get('/healthcheck', (req, res) => {
            const healthcheck = {
                uptime: process.uptime(),
                message: 'OK',
                timestamp: Date.now()
            };
            try {
                return res.status(200).send(healthcheck);
            } catch (e) {
                healthcheck.message = e;
                return res.status(503).send();
            }
        });

        // router.use(this.tokenAuth.checkAuthMiddleware({}));

        // Users admin api
        router.use('/admin/users', usersController.router);

        // Courses admin api
        router.use('/admin/courses', coursesController.router);

        // Courses api
        router.use('/courses', sessionsController.router);

        return router;
    }
}
