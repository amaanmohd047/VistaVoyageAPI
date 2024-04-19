const ApiError = require("../utils/ApiError");

const schemaValidation = (schema) => (req, res, next) => {
  console.log("In try")
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const errorS = error.errors.map((issue) => ({
      message: `${issue.path}: ${issue.message}`,
    }));
    next(new ApiError(400, `${errorS.map(er => er.message)}`));
  }
};

exports.schemaValidation = schemaValidation