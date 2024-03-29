/* eslint-disable no-unused-vars */

const winston = require('winston');

exports.developmentErrorHandler = (err, req, res, next) => {
  winston.error(err.message, err);
  return res.status(err.status || 500).send({ message: err.message });
};

exports.productionErrorHandler = (err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).send({ message: 'Internal server error' });
};
