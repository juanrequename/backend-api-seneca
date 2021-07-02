import { UserModel } from '../../db/models/user.model';

import { IPersistableEntity, PersistableEntity } from '../common';

export interface IUser extends IPersistableEntity {
    email: string;
}

export class User extends PersistableEntity implements IUser {
    private _email: string;

    get email(): string {
        return this._email;
    }

    setEmail(value){
        this._email = value;
        return this;
    }

    toJSON() {
        const base = super.toJSON();

        return {
            ...base,
            email: this._email,
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
        raw: KeyValueHash | typeof UserModel | any,
        options?: KeyValueHash,
    ): User {
        const instance = new this();

        instance
            .setId(raw.id)
            .setAuthorEmail(raw.authorEmail)
            .setName(raw.name)
            .setCreatedAt(raw.createdAt)
            .setUpdatedAt(raw.updatedAt)
            .setEmail(raw.email)

        return instance;
    }
}
