import http from 'http';
import express from 'express';
import serveStatic from 'serve-static';
import compression from 'compression';
import morgan from 'morgan';

import { network as networkConfig } from '../config';
import api from './api';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const httpServer = http.createServer();

const app = express();

app.use(morgan('dev'));
app.use('/api', api);

if (IS_PRODUCTION) {
  app.use(compression());
  app.use('/assets/', serveStatic('./dist'));
} else {
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');

  const compiler = webpack(webpackConfig);
  app.use(webpackHotMiddleware(compiler));
  app.use(compression());
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: '/assets/',
  }));
}

app.use((req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="UTF-8">
        <title>Image</title>
        <link rel="stylesheet" type="text/css" href="/assets/bundle.css">
      </head>
      <body>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
  `);
});

httpServer.on('request', app);
httpServer.listen(networkConfig.port, networkConfig.host, () => {
  console.log('Server started on port ' + networkConfig.port);
});
