/**
 * Anything that can be persisted
 */
export interface IPersistableEntity {
    name?: string;
    id: string | number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IJSONSerializable {
    toJSON(): KeyValueHash;
}

export class PersistableEntity implements IPersistableEntity, IJSONSerializable {
    private _author: KeyValueHash = null;
    private _authorEmail: string = null;
    private _createdAt: Date = null;
    private _id: string | number = null;
    private _name: string = null;
    private _updatedAt: Date = null;

    get author() {
        return this._author;
    }

    get authorEmail() {
        return this._authorEmail;
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    setAuthor(author: KeyValueHash) {
        this._author = author;
        return this;
    }

    setAuthorEmail(value: string) {
        this._authorEmail = value;
        return this;
    }

    setName(name: string) {
        this._name = name;
        return this;
    }

    setId(id: string) {
        this._id = id;
        return this;
    }

    setCreatedAt(date: Date) {
        this._createdAt = date;
        return this;
    }

    setUpdatedAt(date: Date) {
        this._updatedAt = date;
        return this;
    }

    toJSON() {
        return {
            _id: this.id,
            author: this._author,
            authorEmail: this._authorEmail,
            createdAt: this.createdAt,
            name: this.name,
            updatedAt: this.updatedAt,
        };
    }

    static fromRaw(raw: KeyValueHash, options?: KeyValueHash): PersistableEntity {
        const instance = new this();

        instance
            .setId(raw._id || raw.id) // mongoose compatible
            .setName(raw.name)
            .setCreatedAt(raw._createdAt || raw.createdAt)
            .setUpdatedAt(raw._updatedAt || raw.updatedAt);

        if (raw.authorEmail) {
            instance.setAuthorEmail(raw.authorEmail);
        }

        return instance;
    }
}
