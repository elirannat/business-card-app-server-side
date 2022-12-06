const chalk = require("chalk");
const normalizeCard = require("../cards/helpers/normalizeCard");
const normalizeUser = require("../users/helpers/normalizeUser");
const { createCard } = require("../cards/models/cardsAccessDataService");
const { registerUser } = require("../users/models/usersAccessDataService");
const data = require("./initialData.json");

const generateInitialCards = async () => {
  const { cards } = data;
  cards.forEach(async (card) => {
    try {
      const userId = "6376667871c9c1d0b30481f7";
      card = await normalizeCard(userId);
      await createCard(card);
      return;
    } catch (error) {
      console.log(chalk.redBright(error.message));
      return;
    }
  });
};

const generateInitialUsers = async () => {
  const { users } = data;

  users.forEach(async (user) => {
    try {
      user = await normalizeUser();
      await registerUser(user);
      return;
    } catch (error) {
      console.log(chalk.redBright(error.message));
      return;
    }
  });
};

exports.generateInitialCards = generateInitialCards;
exports.generateInitialUsers = generateInitialUsers;