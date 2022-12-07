const express = require("express");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const { generateUserPassword } = require("../helpers/bcrypt");
const normalizeUser = require("../helpers/normalizeUser");
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  changeUserBusinessStatus,
  deleteUser,
} = require("../models/usersAccessDataService");

const {
  validateRegistration,
  validateLogin,
  validateUserUpdate
} = require("../validations/userValidationService");
const router = express.Router();
const { verifyToken } = require('../../auth/providers/jwt')


router.post("/", async (req, res) => {
  try {
    let user = req.body;
    const { error } = validateRegistration(user);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

    user = normalizeUser(user);
    user.password = generateUserPassword(user.password);
    user = await registerUser(user);
    return res.status(201).send(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = req.body;
    const { error } = validateLogin(user);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

    user = await loginUser(req.body);
    return res.send(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin)
      return handleError(
        res,
        403,
        "Authorization Error: You must be an admin user to see all users in the database"
      );

    const users = await getUsers();
    return res.status(200).send(users);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const verifiedUser = verifyToken(req.headers['x-auth-token']);
    if (!req.user.isAdmin && (id != verifiedUser._id))
      return handleError(
        res,
        403,
        "Authorization Error: You must be an admin type user or the registered user to see this user"
      );

    const user = await getUser(id);
    return res.status(200).send(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const rawUser = req.body;
    const { userId } = req.params;

    const { error } = validateUserUpdate(user);
    if (error) return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

    const verifiedUser = verifyAuthToken(req.headers['x-auth-token']);
    if (!rawUser.isAdmin && (userId != verifiedUser._id))
      return handleError(
        res,
        403,
        "Authorization Error: You must the registered user to update this user details"
      );

    rawUser = await normalizeUser(rawUser);
    rawUser = await updateUser(userId, rawUser);
    return res.status(200).send(rawUser);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    let { id } = req.params;
    const verifiedUser = verifyAuthToken(req.headers['x-auth-token']);
    if (!req.user.isAdmin && (id != verifiedUser._id))
      return handleError(
        res,
        403,
        "Authorization Error: You must the registered user or admin to change this user status"
      );
    let user = await changeUserBusinessStatus(id);
    return res.status(200).send(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let { id } = req.params;
    const verifiedUser = verifyAuthToken(req.headers['x-auth-token']);
    if (!req.user.isAdmin && (id != verifiedUser._id))
      return handleError(
        res,
        403,
        "Authorization Error: You must the registered user or admin to delete this user "
      );
    const user = await deleteUser(id);
    return res.status(200).send(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

module.exports = router;