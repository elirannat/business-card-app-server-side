const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
    .connect("mongodb://localhost:27017/eliran_business_card_app")
    .then(() => console.log(chalk.magentaBright("Connected successfully to MongoDB locally!")))
    .catch(error =>
        console.log(chalk.redBright.bold(`could not connect to mongoDb: ${error}`)));