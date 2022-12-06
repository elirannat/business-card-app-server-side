const chalk = require("chalk");
const fileLogger = require("../logger/loggers/fileLogger");

const handleError = (res, status, message = "") => {
  if (status >= 400) fileLogger(status, message);
  console.log(chalk.redBright(message));
  res.status(status).send(message);
};

const handleBadRequest = async (validator, error) => {
  const errorMessage = `${validator} Error: ${error.message}`;
  error.message = errorMessage;
  error.status = error.status || 400;
  return Promise.reject(error);
};

const handleJoiError = async error => {
  const joiError = new Error(error.details[0].message);
  return handleBadRequest("Joi", joiError);
};

exports.handleError = handleError;
exports.handleBadRequest = handleBadRequest;
exports.handleJoiError = handleJoiError;