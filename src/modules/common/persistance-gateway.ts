export interface IDatabaseAdapter {
    execute(...args: any): Promise<any>;
}

export interface IPersistanceGateway {
    db: IDatabaseAdapter;
    setDb(db: IDatabaseAdapter);
}

export class MongoGateway {
    private static _defaultDb;
    private static _defaultModels;
    private _db;
    private _models;

    static setDefaultDb(db) {
        this._defaultDb = db;
        return this;
    }

    static setDefaultModels(models) {
        this._defaultModels = models;
        return this;
    }

    get db() {
        return this._db || MongoGateway._defaultDb;
    }

    get models() {
        return this._models || MongoGateway._defaultModels;
    }

    setDb(db) {
        this._db = db;
        return this;
    }

    setModels(models) {
        this._models = models;
        return this;
    }
}

export class PostgresGateway implements IPersistanceGateway {
    private static _defaultDb: IDatabaseAdapter;
    private static _defaultModels;
    private _db: IDatabaseAdapter;
    private _models;

    static setDefaultDb(db: IDatabaseAdapter) {
        this._defaultDb = db;
        return this;
    }

    static setDefaultModels(models) {
        this._defaultModels = models;
        return this;
    }

    get db() {
        return this._db || PostgresGateway._defaultDb;
    }

    get models() {
        return this._models || PostgresGateway._defaultModels;
    }

    setDb(db: IDatabaseAdapter) {
        this._db = db;
        return this;
    }

    setModels(models) {
        this._models = models;
        return this;
    }
}
