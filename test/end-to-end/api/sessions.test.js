const supertest = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');


const request = supertest('http://0.0.0.0:3000');
const prefix = '/v1/';
const jsonContentTypeExpected = ['Content-Type', 'application/json; charset=utf-8'];

function api(path) {
    return prefix + path;
}

const credentials = {
    'x-user-id': '',
};

const bodyRequest = {
    sessionId: Math.random().toString(36),
    totalModulesStudied: 1,
    averageScore: 1,
    timeStudied: 1
}

describe('Sessions Test', () => {

    let courseId, userId;

    beforeAll(async () => {
        // NOTE: create user and course using APIs
        const user = await request
            .post(api(`/admin/users`))
            .send({
                'name': `name.${ Date.now() }`,
                'email': `user.${ Date.now() }@test.test`
            })
            .expect(...jsonContentTypeExpected)
            .expect(201);

        const course = await request
            .post(api(`/admin/courses`))
            .send({
                'name': `name.${ Date.now() }`,
                'description': `description.${ Date.now() }`
            })
            .expect(...jsonContentTypeExpected)
            .expect(201);

        courseId = course.body._id;
        userId = user.body._id;

        credentials["x-user-id"] = userId;
    });

    describe('Create session stats [POST] /v1/courses/:courseId', () => {

        it('should fail when headers is not provided', async () => {
            await request
                .post(api(`courses/${courseId}`))
                .send(bodyRequest)
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail when body is not provided', async () => {
            await request
                .post(api(`courses/${courseId}`))
                .set(credentials)
                .send({})
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail when path parameter is not valid: courseId', async () => {
            await request
                .post(api(`courses/notvalid`))
                .set(credentials)
                .send({})
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail when body is not valid: parameters required missing', async () => {
            await request
                .post(api(`courses/${courseId}`))
                .set(credentials)
                .send({
                    "totalModulesStudied": 1
                })
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail when body is not valid: sessionId, totalModulesStudied', async () => {
            await request
                .post(api(`courses/${courseId}`))
                .set(credentials)
                .send({
                    "sessionId": '---',
                    "totalModulesStudied": "---",
                    "averageScore": 1,
                    "timeStudied": 1
                })
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should create new session and verify inserted', async () => {
            await request
                .post(api(`courses/${courseId}`))
                .set(credentials)
                .send(bodyRequest)
                .expect(...jsonContentTypeExpected)
                .expect(201)
                .expect((response) => {
                    const { body } = response;

                    expect(body).toBe('OK');
                });

            await request
                .get(api(`courses/${courseId}/sessions/${bodyRequest.sessionId}`))
                .set(credentials)
                .expect(...jsonContentTypeExpected)
                .expect(200)
                .expect((response) => {
                    const { body } = response;

                    expect(body.totalModulesStudied).toBe(bodyRequest.totalModulesStudied);
                    expect(body.timeStudied).toBe(bodyRequest.timeStudied);
                    expect(body.averageScore).toBe(bodyRequest.averageScore);
                });

        });

    });

    describe('Get sessions stats [GET] /v1/courses/:courseId', () => {

        it('should fail when headers is not provided', async () => {
            await request
                .get(api(`courses/${courseId}`))
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail when path parameter is not valid: courseId', async () => {
            await request
                .get(api(`courses/notvalid`))
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should success: not found data but returns default obj values to 0', async () => {
            const randomId = mongoose.Types.ObjectId();
            await request
                .get(api(`courses/${randomId}`))
                .set(credentials)
                .expect(...jsonContentTypeExpected)
                .expect(200)
                .expect((response) => {
                    const { body } = response;

                    expect(body.totalModulesStudied).toBe(0);
                    expect(body.timeStudied).toBe(0);
                    expect(body.averageScore).toBe(0);
                });
        });

        it('should success get sessions stats', async () => {
            await request
                .get(api(`courses/${courseId}`))
                .set(credentials)
                .expect(...jsonContentTypeExpected)
                .expect(200)
                .expect((response) => {
                    const { body } = response;

                    expect(body.totalModulesStudied).toBeGreaterThanOrEqual(0);
                    expect(body.timeStudied).toBeGreaterThanOrEqual(0);
                    expect(body.averageScore).toBeGreaterThanOrEqual(0);
                });
        });

    });

    describe('Get session stats by Id [GET] /v1/courses/:courseId/sessions/:sessionId', () => {

        it('should fail when headers is not provided', async () => {
            await request
                .get(api(`courses/${courseId}/sessions/${bodyRequest.sessionId}`))
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail when path parameter is not valid: courseId', async () => {
            await request
                .get(api(`courses/notvalid/sessions/notvalid`))
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should fail get session stat not found', async () => {
            const randomId = mongoose.Types.ObjectId();
            await request
                .get(api(`courses/${randomId}/sessions/${randomId}`))
                .set(credentials)
                .expect(...jsonContentTypeExpected)
                .expect(400)
                .expect((response) => {
                    const { body } = response;
                    const { errors } = body;

                    expect(body).toHaveProperty('errors');
                    expect(errors.length).toBeGreaterThan(0);
                });
        });

        it('should success get session stats', async () => {
            // create new session stat
            const bodyRequestTest = _.clone(bodyRequest);
            bodyRequestTest.sessionId = Math.random().toString(36);

            await request
                .post(api(`courses/${courseId}`))
                .set(credentials)
                .send(bodyRequestTest)
                .expect(...jsonContentTypeExpected)
                .expect(201)
                .expect((response) => {
                    const { body } = response;

                    expect(body).toBe('OK');
                });

            // get session stats and check results
            await request
                .get(api(`courses/${courseId}/sessions/${bodyRequestTest.sessionId}`))
                .set(credentials)
                .expect(...jsonContentTypeExpected)
                .expect(200)
                .expect((response) => {
                    const { body } = response;

                    expect(body.totalModulesStudied).toBe(bodyRequestTest.totalModulesStudied);
                    expect(body.timeStudied).toBe(bodyRequestTest.timeStudied);
                    expect(body.averageScore).toBe(bodyRequestTest.averageScore);
                });
        });

    });
});
