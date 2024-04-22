const { check, validationResult } = require("express-validator");

const validateReflection = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("body").not().isEmpty().withMessage("Body is required"),
  check("isPublic").isBoolean().withMessage("isPublic must be a boolean"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateReflection;
