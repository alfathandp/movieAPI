const express = require('express');
const {logger} = require ('./configurations')
const {middleware} = require('./middlewares');
const routes = require('./routes');
const createError = require('http-errors')

const app = express();

process.on('unhandledRejection', (reason) => {
  logger.error(reason);
  process.exit(1);
});

//middleware
middleware(app);
//routes
routes(app);

app.use((req,res,next) => {
  const error = createError(404);
  next(error);
});

app.use((error, req, res, next) => {
  logger.error(error.message);
  console.error(error);
  res.statusCode = error.statusCode;
  res.json({
    message: error.message
  });
});
 

module.exports = app;
