import { CourseModel } from '../../db/models/course.model';

import { IPersistableEntity, PersistableEntity } from '../common';

export interface ICourse extends IPersistableEntity {
    description: string;
}

export class Course extends PersistableEntity implements ICourse {
    private _description: string;

    get description(): string {
        return this._description;
    }

    setDescription(value){
        this._description = value;
        return this;
    }

    toJSON() {
        const base = super.toJSON();

        return {
            ...base,
            description: this._description,
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
        raw: KeyValueHash | typeof CourseModel | any,
        options?: KeyValueHash,
    ): Course {
        const instance = new this();

        instance
            .setId(raw.id)
            .setAuthorEmail(raw.authorEmail)
            .setName(raw.name)
            .setCreatedAt(raw.createdAt)
            .setUpdatedAt(raw.updatedAt)
            .setDescription(raw.description)

        return instance;
    }
}
