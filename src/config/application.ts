export default {
    httpPort: process.env.APP_HTTP_PORT,
    publicUrl: process.env.APP_PUBLIC_URL,
    environmentName: process.env.APP_ENVIRONMENT_NAME || 'local',
    log: {
        level: process.env.APP_LOG_LEVEL || 'debug',
    },
    mongoDb: {
        database: process.env.APP_MONGO_DATABASE,
        host: process.env.APP_MONGO_HOST,
        pass: process.env.MONGO_PASS,
        port: process.env.MONGO_PORT,
        srv: process.env.MONGO_SRV,
        user: process.env.APP_MONGO_USER,
    },
    appAdminAccessIPList: process.env.APP_ADMIN_ACCESS_IP_LIST,
};
