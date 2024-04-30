const { check, validationResult } = require("express-validator");

const validateUsers = [
  check("email")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain a special character"),
  check("name")
    .not().isEmpty()
    .withMessage("Name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUsers;
