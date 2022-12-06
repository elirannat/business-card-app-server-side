const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const userName = config.get("DB_NAME");
const password = config.get("DB_PASSWORD");

mongoose
    .connect(`mongodb+srv://${userName}:${password}@cluster0.gaz5mv0.mongodb.net/eliran_business_card_app`)
    .then(() => console.log(chalk.magentaBright("Connected successfully to MongoDB atlas!")))
    .catch((error) =>
        console.log(chalk.redBright.bold(`MongoDB Error: Couldn't connect to MongoDB: ${error}`)));