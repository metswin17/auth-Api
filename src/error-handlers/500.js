'use strict';

/*
  In this example, we directly export an anonymous function

  NOTE: this one has 4 parameters, which means Express knows intrinsically that it is for handling server errors

  Because we'll be building out an API that works with JSON, let's format
  our response as a JSON object
*/

module.exports = function (err, req, res, next) {

  // Sometimes, errors come in as an object, others as a string
  const error = err.message ? err.message : err;

  let status = err.status || err.statusCode || 500;

  if (error === 'Invalid Login') {
    status = 401;
  }

  if (error === 'Access Denied') {
    status = 403;
  }

  const errorObject = {
    status: status,
    message: error
  };

  res.status(status).json(errorObject);
};
