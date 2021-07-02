import {ISessionModel, SessionModel} from '../../db/models/session.model';
import {MongoGateway} from '../common/persistance-gateway';
import {Types} from 'mongoose';
import {Session} from '../sessions/session';


interface GetSessionsParameters {
    userId: string,
    courseId: string,
}

interface GetSessionParameters {
    userId: string,
    courseId: string,
    sessionId: string
}

interface GetSessionsResponse {
    totalModulesStudied: number,
    timeStudied: number,
    averageScore: number
}

export class SessionGateway extends MongoGateway {
    private _sessionModel = SessionModel;

    setSessionModel(model: typeof SessionModel) {
        this._sessionModel = model;
        return this;
    }

    async getSessions({ userId, courseId }: GetSessionsParameters): Promise<GetSessionsResponse> {
        const query: any = {
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId)
        };

        const [countResult] = await SessionModel.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '',
                    totalModulesStudied: {$sum: '$totalModulesStudied'},
                    timeStudied: {$sum: '$timeStudied'},
                    averageScore: {$avg: '$averageScore'}
                }
            },
            {
                $project: {
                    _id: 0,
                    totalModulesStudied: 1,
                    timeStudied: 1,
                    averageScore: 1
                }
            }
        ]);

        if (!countResult) {
            const emptyResult: GetSessionsResponse = {
                totalModulesStudied: 0,
                timeStudied: 0,
                averageScore: 0
            }
            return emptyResult;
        }

        return countResult;
    }

    async getSession({ userId, courseId, sessionId }: GetSessionParameters): Promise<ISessionModel> {
        const query: any = {
            userId,
            courseId,
            sessionId
            // _id: sessionId
        }

        const project: any = {
            _id: 0,
            sessionId: 1,
            totalModulesStudied: 1,
            timeStudied: 1,
            averageScore: 1
        }

        const session = await this._sessionModel.findOne(query, project)
            .exec();

        return session;
    }

    async createSession(session: Session): Promise<Session> {
        const modelValues = {
            ...session.toModelValues(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const created = await this._sessionModel.create(modelValues);

        return Session.fromRaw(created);
    }

}
