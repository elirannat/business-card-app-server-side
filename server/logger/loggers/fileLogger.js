const chalk = require("chalk");
const path = require("path");
const { writeFile, appendFile } = require("fs");
const fs = require("fs");
const currentTime = require("../../utils/timeService");

const fileLogger = (status, message) => {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  const fileName = `${year}${month}${day}.log`;
  const dirLogs = path.join(__dirname, "../", "logs", fileName);
  const logMessage = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}: Status: ${status}, Message: ${message} `;
  const isExists = fs.existsSync(dirLogs);

  if (!isExists)
    return writeFile(dirLogs, logMessage, error => {
      if (error) console.log(chalk.bgRedBright(error.message));
    });

  appendFile(dirLogs, `\n${logMessage}`, err => {
    if (err) return console.log(chalk.bgRedBright(err.message));
  });
};

module.exports = fileLogger;