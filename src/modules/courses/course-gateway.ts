import { CourseModel, } from '../../db/models/course.model';

import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE } from '../common/pagination';
import { MongoGateway } from '../common/persistance-gateway';
import { Course } from './course';
import { logger } from '../../app';

interface GetCoursesParameters {
    page: number;
    pageSize: number;
}

interface GetCourseByIdParameters {
    id: string;
}

interface GetCoursesResult {
    count: number;
    rows: any;
}

export class CourseGateway extends MongoGateway {
    private _courseModel = CourseModel;

    setCourseModel(model: typeof CourseModel) {
        this._courseModel = model;
        return this;
    }

    async getCourses({
                          page = DEFAULT_PAGE_NUM,
                          pageSize = DEFAULT_PAGE_SIZE,
                      }: GetCoursesParameters): Promise<GetCoursesResult> {

        const query: any = {};

        const rows = await this._courseModel.find(query)
            .sort({ createdAt: 'descending' })
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const count = await this._courseModel.count(query);

        return {
            count,
            rows,
        };
    }

    async createCourse(course: Course): Promise<Course> {
        logger.debug('Creating course... CourseEmail: %s', course.authorEmail);

        const modelValues = {
            ...course.toModelValues(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const created = await this._courseModel.create(modelValues);

        return Course.fromRaw(created);
    }

    async getCourseById({ id }: GetCourseByIdParameters) {
        const query = {
            _id: id,
        };
        return CourseModel.findOne(query).exec();
    }
}
