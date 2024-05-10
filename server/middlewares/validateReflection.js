const { check, validationResult } = require("express-validator");
const validateReflection = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("body").not().isEmpty().withMessage("Body is required"),
  check("isPublic")
    .custom((value, { req }) => {
      // Assuming the value might be in req.body if form-data is correctly parsed
      return ["true", "false"].includes(req.body.isPublic);
    })
    .withMessage("isPublic must be string 'true' or 'false'"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateReflection;
