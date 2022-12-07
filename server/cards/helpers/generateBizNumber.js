const Card = require("../models/mongodb/Card");
const lodash = require("lodash");
const { handleBadRequest } = require("../../utils/errorHandler");

const generateBizNumber = async () => {
  try {
    const random = lodash.random(1_000_000, 9_999_999);
    const card = await Card.findOne(
      { bizNumber: random },
      { bizNumber: 1, _id: 0 }
    );
    if (card) return generateBizNumber();
    return random;
  } catch (error) {
    return handleBadRequest("GenerateBizNumber", error);
  }
};

const generateBizNumberFromAdmin = async (number) => {
  try {
    const card = await Card.findOne(
      { bizNumber: number },
      { bizNumber: 1, _id: 1 }
    );
    if (card)
      throw new Error("Authorization Error: We are sorry but this number is busy");
    return number;
  } catch (error) {
    handleBadRequest("generatBizNumber", error);
  }
};

exports.generateBizNumber = generateBizNumber;
exports.generateBizNumberFromAdmin = generateBizNumberFromAdmin;