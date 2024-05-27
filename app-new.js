'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const path = require('path');
const http = require('http');
const https = require('https');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const redis = require('redis')
const session = require('express-session');
const {v4: uuid} = require('uuid');
var fs = require('fs');
var config = require('./src/config/config');

var app = express();

var router = express.Router();

process.env.TZ = "Asia/Kolkata";

app.use(helmet());
app.use(cors());

app.set('trust proxy', 1);
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(fileUpload({
    parseNested: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var RedisStore = require('connect-redis')(session);

var client = redis.createClient({
    host: config.session_redis.host,
    port: config.session_redis.port,
    // password: '11aa22bb33cc44dd55ee',
    db: 1,
});
client.on('error', console.log);

app.use(session({
    key: config.session.key,
    store: new RedisStore({ client }),
    secret: config.session.secret,
    saveUninitialized: false,
    resave: false,
    cookie: config.cookie
}));

morgan.token('id', function getId(req) {
    return req.id;
});

app.use(assignId);
app.use(morgan("[:date[iso] #:id] \x1b[36mStarted\x1b[0m     :method  :remote-addr  :url", {immediate: true}));
app.use(morgan("[:date[iso] #:id] \x1b[33mCompleted\x1b[0m   :status  :remote-addr  :url  :res[content-length] in :response-time ms"));

if (config.env === 'development') {
    app.use(errorhandler());
}

// require('./src/model/db');

app.use(function(req, res, next) {
    res.locals.passport = req.session.passport;
    next();
});

require('./src/config/passport')(app);
require('./src/routes')(app);

function assignId (req, res, next) {
    req.id = uuid();
    next()
}

var port = normalizePort(process.env.PORT || '7037');

const NODE_ENV = process.env.NODE_ENV ?
    process.env.NODE_ENV.toLowerCase() :
    'development';

app.set('port', port);

// var server = NODE_ENV == "production" || NODE_ENV == "staging" ?
//     https.createServer({
//         key: fs.readFileSync(process.env.KEY_FILE),
//         cert: fs.readFileSync(process.env.CERT_FILE)
//     }, app) :
  var server = http.createServer(app);


server.listen(port);
server.on('error', onError);
server.on('listening', onlistening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.log(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.log(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onlistening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind + ' in ' + NODE_ENV);
}


module.exports = app;