import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

export class MongoConnector {
    _mongoConfig;

    setConfig(value) {
        this._mongoConfig = value;
        return this;
    }

    async connect() {
        const { user, pass, srv } = this._mongoConfig;
        const url = this._getMongoURL();
        const mongoOptions = {
            useNewUrlParser: true,
            ...(srv && { user, pass }),
        };

        return new Promise<void>((resolve, reject) => {
            mongoose.set('useUnifiedTopology', true);
            mongoose.set('useCreateIndex', true);
            mongoose.connect(url, mongoOptions, (err: MongoError) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    _getMongoURL() {
        const { host, database, user, pass, port, srv } = this._mongoConfig;
        const authPart = pass ? `${user}:${pass}@` : '';
        if (srv) {
            return `mongodb+srv://${host}/${database}?ssl=true&authSource=admin`;
        }
        return `mongodb://${authPart}${host}:${port}/${database}`;
    }
}
