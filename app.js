/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/**
 * Module dependencies.
 */
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import logger from 'morgan';

import dotenv from 'dotenv';
import flash from 'express-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import fs from 'fs';
import log4js from 'log4js';
import cors from 'cors';
import session from 'express-session';
import { exec } from 'child_process';
import chalk from 'chalk';
import MongoStore from 'connect-mongo';
import { fileURLToPath } from 'url';
import log4j from './src/config/configLog4js.js';
import { handleError } from './src/utils/errorsHandler.js';
import initPassportport from './src/config/passport.js';

/**
  * Routes
  */
import appRoutes from './src/routes/index.js';
import createAdmin from './src/helpers/createAdmin.js';

/**
  * Load environment variables from .env file,
  */
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
  * Create Express server.
  */
const app = express();

app.use(cors({ origin: true, credentials: true }));

/**
  * Connect to MongoDB.
  */

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('error', () => {
  log4j.loggerinfo.error(
    `%s MongoDB connection error.
   Please make sure MongoDB is running.`,
    chalk.red('✗')
  );
  process.exit();
});

/**
  * Express configuration.
  */
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.use(compression());

app.use(logger('dev', {
  stream: fs.createWriteStream('./appLogs.log', { flags: 'a' }),
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
  }),
}));
app.use(log4js.connectLogger(log4j.loggercheese, { level: 'info' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
  * Security
  */
app.use(helmet());
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads'),
    { maxAge: 31557600000 }
  )
);
app.use(
  '/assets',
  express.static(
    path.join(__dirname, 'assets'),
    { maxAge: 31557600000 }
  )
);

createAdmin();

/**
  * Iniate passpro.
  */
initPassportport();
/**
  * App routes.
  */
app.use('/users', appRoutes.usersRoutes);
app.use('/', appRoutes.authRoutes);

// Used to show last commit date
let lastBuildDate = null;
exec("stat -c '%y' ./package.json", (error, stdout, stderr) => {
  lastBuildDate = stdout;
});

app.get('/', (req, res, next) => {
  res.status(200).json({
    msg: 'project_name API',
    port: process.env.PORT || 5000,
    lastBuildDate,
  });
});
/**
  * Error Handler.
  */

app.use((err, req, res, next) => {
  console.log('er========+>', err, next);
  handleError(err, res);
});

/**
  * Start Express server.
  */

app.listen(app.get('port'), () => {
  log4j.loggerinfo.info(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env'),
  );
  log4j.loggerinfo.info('  Press CTRL-C to stop\n');
});

export default app;
