import dotenv from 'dotenv';
dotenv.config();

import applicationConfig from './config/application';

import winston from 'winston';
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'combined.log' })
    ]
});


import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApplicationContainer } from './modules/core/application-container';
import models from './db/models';
import { ApiRouter } from './api/v1/router';
import { ProcessSignal } from './modules/common';
import { ExpressController } from './modules/core/controller';
import { MongoGateway } from './modules/common/persistance-gateway';
import { MongoConnector } from './modules/common/mongo-connector';
import { SwaggerRouter } from './api/swagger-router';


// Not use authentication - replace by TokenAuthenticator
const tokenAuth = 'Asdf1234';

async function bootStrapApplication() {

    const app = new ApplicationContainer();
    const expressApp = express();

    // allow any controller to access the applicationContainer
    ExpressController.setDefaultAppContainer(app);
    // Allow gateways to have models
    MongoGateway.setDefaultModels(models);

    // Initialize the app container
    app.setModels(models)
        .setApp(expressApp)
        .useMiddleware(bodyParser.urlencoded({ extended: false }))
        .useMiddleware(bodyParser.text({ type: 'text/xml' }))
        .useMiddleware(bodyParser.json())
        .useMiddleware(cors()) // TODO: configure allowed routes and origins
        .useRouter('/docs', new SwaggerRouter({ tokenAuth }).build())
        .useRouter('/v1', new ApiRouter({ tokenAuth }).build());

    for (const signal of Object.values(ProcessSignal)) {
        process.once(signal, () => app.shutdown(signal));
    }

    const connector = new MongoConnector();
    connector.setConfig(applicationConfig.mongoDb);
    await connector.connect();

    await app.start(applicationConfig.httpPort);
}

bootStrapApplication().catch(exception => {
    logger.error('Failed to bootstrap application', exception);
    process.exit(1);
});

process.on('unhandledRejection', (error) => shutdown(error));

function shutdown(error) {
    logger.info('Attention! Unhandled rejection detected. Some code throws error that is unhandled', error);
}
