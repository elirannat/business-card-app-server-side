const express = require("express");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const normalizeCard = require("../helpers/normalizeCard");
const {
  getCards,
  getMyCards,
  getCard,
  createCard,
  updateCard,
  likeCard,
  deleteCard,
} = require("../models/cardsAccessDataService");
const validateCard = require("../validations/cardValidationService");
const router = express.Router();
const { generateBizNumberFromAdmin } = require("../helpers/generateBizNumber");

router.get("/", async (req, res) => {
  try {
    const cards = await getCards();
    return res.send(cards);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await getMyCards(userId);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const card = await getCard(id);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    let card = req.body;
    const user = req.user;
    const { error } = validateCard(card);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

    card = await normalizeCard(card, user._id);

    card = await createCard(card);
    return res.status(201).send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    let card = req.body;
    const cardId = req.params.id;
    const user = req.user;

    if (user._id !== card.user_id) {
      const message =
        "Authorization Error: Only the user who created the business card can update its details";
      return handleError(res, 403, message);
    }

    const { error } = validateCard(card);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

    card = await normalizeCard(card);
    card = await updateCard(cardId, card);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id;
    const card = await likeCard(cardId, userId);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.patch("/number/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { isAdmin } = user;
    if (!isAdmin)
      return handelError(
        res,
        403,
        "Authorization Error: You must be an isAdmin type user for create number"
      );

    const bizNumber = await generateBizNumberFromAdmin(189918);
    if (!bizNumber)
      return handelError(
        res,
        403,
        "Authorization Error: We are sorry but this number is busy"
      );
    const cardUpdate = await Card.findByIdAndUpdate(
      id, { bizNumber: bizNumber }, { new: true });
    return res.send(cardUpdate);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const cardId = req.params.id;
    const user = req.user;
    const card = await deleteCard(cardId, user);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

module.exports = router;