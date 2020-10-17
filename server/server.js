"use strict";

///////////////////////////////////////////////////////////////////////////////
// Required modules for app
///////////////////////////////////////////////////////////////////////////////

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const nocache = require('nocache');

// load ENV variables from .env
require('dotenv').config();

// work around intermediate CA issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const UTILS = require('./utils');

///////////////////////////////////////////////////////////////////////////////
// Constants to be shared amongst modules.
///////////////////////////////////////////////////////////////////////////////

const C = {

  CODE_NULL:             -2,
  CODE_ERROR:            -1,
  CODE_OK:                1,
  CODE_NOT_FOUND:         2,
  CODE_NOT_RESOLVED:      3,
  CODE_WARN:              4,

  DIR:                    __dirname,

  // Determines if running locally (if so, no port defined).
  LOCAL:                  process.env.PORT == undefined,

  CONFIG:                 undefined,
  TOKEN:                  undefined,
	LOG:                    undefined,

	PORT:										3000
}

///////////////////////////////////////////////////////////////////////////////
// Set up configuration based on environment.
///////////////////////////////////////////////////////////////////////////////

const ENV = process.env.ENV ? process.env.ENV : 'dev';
const CONFIG = require('./config')(C);
const CONFIG_API_KEY = 'api';
C.CONFIG = CONFIG;
C.TOKEN = process.env.TOKEN ? process.env.TOKEN : CONFIG.token;

///////////////////////////////////////////////////////////////////////////////
// Setup logging.
///////////////////////////////////////////////////////////////////////////////

C.LOG = require('winston');
C.LOG.remove(C.LOG.transports.Console);
C.LOG.add(C.LOG.transports.Console, { level: CONFIG.log.level, colorize: true });
const L = C.LOG;

///////////////////////////////////////////////////////////////////////////////
// Load application environment.
///////////////////////////////////////////////////////////////////////////////

const app = express();

app.use(cors());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

const ensureAuthenticated = (req, res, next) => {

  if (req.headers && req.headers.token == C.TOKEN) {
    return next();
  }
  else {
    res.send(401);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Set up essential routes.
///////////////////////////////////////////////////////////////////////////////

const registerRoutes = callback => {

  // Route to get general API message.
  app.get('/api', (req, res) => {
    L.verbose('/api: Entered.');
    res.json({ ok: true, message: `Welcome to the ${CONFIG.application.shortName} API '${ENV}' environment${C.LOCAL ? ' running locally' : ''}.`});
  });

  callback();
}

///////////////////////////////////////////////////////////////////////////////
// Load resources, register route modules, and start up app.
///////////////////////////////////////////////////////////////////////////////

const load = callback => {

  app.use((req, res, next) => {
    res.set('X-Powered-By', C.CONFIG.application.name);
    next();
  });

  // FOR DEBUGGING
  //app.use(nocache());

  const apiRoutes = express.Router();

  // Register API Routes.
  registerRoutes(() => {
    const routes = require('./routes')(C, apiRoutes, ensureAuthenticated, CONFIG_API_KEY);
    UTILS.mergeRecursive(CONFIG, routes.getConfig());
  });

  // Apply the routes to our application with the prefix /api.
  app.use('/api', apiRoutes);

  // Start jobs
  require('./jobs')(C, app, apiRoutes, ensureAuthenticated);

  callback();
}

load(() => {

  var os = require("os");
  L.info(`Hostname: ${os.hostname()}`);

	let port = C.PORT;

  if (process.env.PORT != undefined) {
    port = parseInt(process.env.PORT);
  }

  app.listen(port, () => {

    L.verbose(`Application Configuration: ${ENV}\n ${JSON.stringify(CONFIG, null, 2)}`);

    if (C.LOCAL) {
      L.info(`To view your app, open this link in your browser: http://localhost:${port}`);
    }
    else {
      L.info(`Running in Cloud on Port='${port}' Env='${ENV}'.`);
    }
  });
});
