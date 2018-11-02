import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import fs from 'fs';
import path from 'path';

import config from './config';
import routes from '../routes';

const app = express();

// pretty output
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// enable logging
if (config.logging && config.logging.enable) {
  if (!fs.exists('log')) {
    fs.mkdirSync('log');
  }
  app.use(logger(config.logging.format || 'combined', {
    stream: fs.createWriteStream(path.join('log', 'access.log'), { flags: 'a' })
  }));
}

// register body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({}));
// allow method override
app.use(methodOverride());

// // production error handler
// // no stacktraces leaked to user
app.use((err, req, res, next) => {
  return res.status(500).end();
});

export default app;
