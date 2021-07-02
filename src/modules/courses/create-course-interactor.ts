import { Interactor, IRequestObject } from '../core';
import joi from 'joi';
import { CourseGateway } from './course-gateway';
import { Course } from './course';
import { logger } from '../../app';

export interface CreateCourseRequestObject extends IRequestObject {
    id?: string,
    name: string,
    description: string,
}

export const validationSchema = joi.object().keys({
    name: joi
        .string()
        .required(),
    description: joi
        .string()
        .required(),
});

export class CreateCourseInteractor extends Interactor {
    private _courseGateway: CourseGateway = null;

    setCourseGateway(gateway: CourseGateway) {
        this._courseGateway = gateway;
        return this;
    }


    async execute(request: CreateCourseRequestObject) {
        try {
            let course;

            course = Course.fromRaw(request);
            const { id: courseId } = await this._courseGateway.createCourse(course);

            const created = await this._courseGateway.getCourseById({ id: courseId.toString() });

            await this.presenter.success(created);

            return true;
        } catch (e) {
            logger.error('Failed to create course', request, e);
            this.presenter.error([e.message]);

            return false;
        }
    }
}
