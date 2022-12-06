const Joi = require("joi");

const loginValidation = user => {
  const schema = Joi.object({
    email: Joi.string()
      .ruleset.pattern(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: "User 'Email' must be a valid mail" })
      .required(),

    password: Joi.string()
      .ruleset.regex(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
      )
      .rule({
        message:
          "The password must include at least six characters uppercase and lowercase letter number and one of the following special characters: !@#$%^&* -",
      })
      .required(),
  });
  return schema.validate(user);
};

module.exports = loginValidation;