import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';
import log4j from './src/config/configLog4js.js';
import { handleError } from './src/utils/errorsHandler.js';

/**
  * Load environment variables from .env file,
  */
dotenv.config({ path: '.env' });
/**
  * Connect to MongoDB.
  */

mongoose.connect(process.env.MONGODB_URI)
  .then(() => log4j.loggerinfo.info(
    'Database connected!',
  ))
  .catch((err) => log4j.loggerinfo.error(
    'MongoDB connection error.%s',
    err
  ));

mongoose.connection.on('error', () => {
  log4j.loggerinfo.error(
    `MongoDB connection error.
  Please make sure MongoDB is running.`,
  );
  process.exit();
});

app.set('port', process.env.PORT || 3000);

/**
  * Error Handler.
  */
app.use((err, req, res, next) => {
  handleError({ err, req, res, next });
});

/**
    * Start Express server.
    */
app.listen(app.get('port'), () => {
  log4j.loggerinfo.info(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  log4j.loggerinfo.info('  Press CTRL-C to stop\n');
});
