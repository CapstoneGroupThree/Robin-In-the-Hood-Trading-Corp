// logging middleware

const chalk = require('chalk');

const morgan = require('morgan');

// define preferred format for logging
const loggerFormat = 'dev';

const logger = morgan(loggerFormat);

module.exports = logger;