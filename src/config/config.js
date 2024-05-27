"use strict";

module.exports = {

    env: process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development',
    port: process.env.PORT || 7037,
    session_redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: process.env.REDIS_DB || 1
    },
    session: {
        key: process.env.SESSION_ID || 'nm_.sid',
        secret: process.env.SESSION_SECRET || '11aa22bb33cc44dd11aa22bb33cc44dd11aa22bb33cc44dd11aa22bb33cc44ddf'
    },
    jwt: {
        secret: process.env.JWT_SECRET || "1a1a2b2b3c3c4d4d5e5e6f6f1a1a2b2b3c3c4d4d5e5e6f6f1a1a2b2b3c3c4d4d5e5e6f6f"
    },
    mail_credentials:{
        mail: "",
        password:"",
        mail_to: "",
        port: process.env.SMTP_PORT || 465,
        secure: process.env.SMTP_SECURE || false

    },
    mongodb: {
        host: process.env.MONGODB_HOST || 'marengo.ohzazyl.mongodb.net',
        port: process.env.MONGODB_PORT || '27017',
        username: process.env.MONGODB_USERNAME || 'marengo',
        password: process.env.MONGODB_PASSWORD || 'marengo2022',
        auth_db: process.env.MONGODB_AUTH_DB || 'admin',
        app_db: process.env.MONGODB_APP_DB || 'somany'
    },
    totp: {
        secret: process.env.JWT_SECRET || 'KVKFKRCRNZQUZMLXOVYDSQKJKQDTSRLDDSDDD',
        window: 10
    },
    cookie: {
        domain: process.env.COOKIE_DOMAIN || undefined,
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 2 * 24 * 60 * 60 * 1000 // in ms
    }
};