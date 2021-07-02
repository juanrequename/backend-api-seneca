import { ExpressController, ExpressJSONSearchPresenter, ExpressJSONCreatePresenter, /*ExpressJSONShowPresenter */ } from '../../modules/core';

import { CourseGateway } from '../../modules/courses/course-gateway';
import { GetCoursesInteractor, GetCoursesRequestObject, validationSchema as getAllSchema } from '../../modules/courses/get-courses-interactor';
import { CreateCourseRequestObject, validationSchema as createSchema } from '../../modules/courses/create-course-interactor';
import { CreateCourseInteractor } from '../../modules/courses/create-course-interactor';

export class CoursesController extends ExpressController {
    constructor() {
        super();

        this.router.get('/', this.validator.validateQuery(getAllSchema), this.getCourses.bind(this));

        this.router.post('/', this.validator.validateBody(createSchema), this.createCourse.bind(this));
    }

    async getCourses(req, res, next) {
        const courseGateway = new CourseGateway();
        const interactor = new GetCoursesInteractor();

        const presenter = new ExpressJSONSearchPresenter(req, res, next);

        const request = req.query as GetCoursesRequestObject;

        interactor.setPresenter(presenter).setCourseGateway(courseGateway);
        await interactor.execute(request);
    }

    async createCourse(req, res, next) {
        const courseGateway = new CourseGateway();
        const interactor = new CreateCourseInteractor();
        const presenter = new ExpressJSONCreatePresenter(req, res, next);

        const request = req.body as CreateCourseRequestObject;

        interactor.setPresenter(presenter).setCourseGateway(courseGateway);

        await interactor.execute(request);
    }
}
