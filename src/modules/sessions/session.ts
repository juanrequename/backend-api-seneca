import { SessionModel } from '../../db/models/session.model';

import { PersistableEntity } from '../common';


export class Session extends PersistableEntity {

    private _sessionId: string;
    private _userId: KeyValueHash;
    private _courseId: KeyValueHash;
    private _totalModulesStudied: number;
    private _averageScore: number;
    private _timeStudied: number;

    get sessionId(): string {
        return this._sessionId;
    }

    get userId(): KeyValueHash {
        return this._userId;
    }

    get courseId(): KeyValueHash {
        return this._courseId;
    }

    get totalModulesStudied(): number {
        return this._totalModulesStudied;
    }

    get averageScore(): number {
        return this._averageScore;
    }

    get timeStudied(): number {
        return this._timeStudied;
    }

    setSessionId(sessionId: string): Session {
        this._sessionId = sessionId;
        return this;
    }

    setUserId(user: KeyValueHash): Session {
        this._userId = user;
        return this;
    }

    setCourseId(course: KeyValueHash): Session {
        this._courseId = course;
        return this;
    }

    setTotalModulesStudied(totalModulesStudied: number): Session {
        this._totalModulesStudied = totalModulesStudied;
        return this;
    }

    setAverageScore(averageScore: number): Session {
        this._averageScore = averageScore;
        return this;
    }

    setTimeStudied(timeStudied: number): Session {
        this._timeStudied = timeStudied;
        return this;
    }

    toJSON() {
        const base = super.toJSON();

        return {
            ...base,
            userId: this._userId,
            sessionId: this._sessionId,
            courseId: this._courseId,
            totalModulesStudied: this._totalModulesStudied,
            averageScore: this._averageScore,
            timeStudied: this._timeStudied,
        };
    }

    toModelValues() {
        const raw = this.toJSON();

        for (const key of Object.keys(raw)) {
            if (!raw[key]) delete raw[key];
        }

        return raw;
    }

    static fromRaw(
        raw: KeyValueHash | typeof SessionModel | any,
        options?: KeyValueHash,
    ): Session {
        const instance = new this();

        instance
            .setId(raw.id)
            .setSessionId(raw.sessionId)
            .setUserId(raw.userId)
            .setCourseId(raw.courseId)
            .setTotalModulesStudied(raw.totalModulesStudied)
            .setAverageScore(raw.averageScore)
            .setTimeStudied(raw.timeStudied)
            .setCreatedAt(raw.createdAt)
            .setUpdatedAt(raw.updatedAt)

        // if (options) {
        //     const { user } = options;
        //
        //     if (user) {
        //         instance.setUser(user);
        //     }
        // }

        return instance;
    }
}
