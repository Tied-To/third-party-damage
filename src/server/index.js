const browserify = require('browserify-middleware');
const express = require('express');
const routes = express.Router();
const browserifyPath = process.env.NODE_ENV === 'production' ? './dist' : './src';
const Path = require('path');
const app = express();
const port = process.env.PORT || 4000;

const assetFolder = Path.resolve(__dirname, '../../public');
routes.use(express.static(assetFolder));

browserify.settings({
  transform: ['babelify'],
});

routes.get('/app-bundle.js',
  browserify(`${browserifyPath}/client/app.js`));

// routes.get('/css/app-bundle.css',
  // sass.serve('./public/sass/app.sass'));

if (process.env.NODE_ENV !== 'test') {
  /**
    * The Catch-all Route
    * This is for supporting browser history pushstate.
    * NOTE: Make sure this route is always LAST.
  */
  routes.get('/*', (req, res) => {
    res.sendFile(`${assetFolder}/index.html`);
  });

  /**
    * We're in development or production mode;
    * create and run a real server.
  */

  // Parse incoming request bodies as JSON
  app.use(require('body-parser').json());
  // Mount our main router
  app.use('/', routes);

  // Start the server!
  app.listen(port);
} else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}