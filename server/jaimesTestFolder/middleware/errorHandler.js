// error handling middleware:

const chalk = require('chalk');

function handleError(err, req, res, next) {
    console.log(chalk.red.bold('Error in handleError: ', err.message));
    res.status(500).send('Something broke!');
}

module.exports = handleError;

// Path: routes/routes.js