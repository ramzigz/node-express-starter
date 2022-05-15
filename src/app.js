/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/**
 * Module dependencies.
 */
import 'module-alias/register.js';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import logger from 'morgan';
import flash from 'express-flash';
import path from 'path';
import passport from 'passport';
import fs from 'fs';
import log4js from 'log4js';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import { fileURLToPath } from 'url';
import log4j from './config/configLog4js.js';
import initPassportport from './config/passport.js';

/**
  * Routes
  */
import appRoutes from './v1/routes/index.js';
import createAdmin from './helpers/createAdmin.js';

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
  * Express configuration.
  */
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

createAdmin();

/**
  * Iniate passpro.
  */
initPassportport();
/**
  * App routes.
  */

app.use('/api/v1', appRoutes);

app.get('/', (req, res, next) => {
  res.status(200).json({
    msg: 'node-express-starter API',
    port: process.env.PORT || 3000,
  });
});

export default app;
