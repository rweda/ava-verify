const ExtendableError = require("./ExtendableError");

class FailedTestError extends ExtendableError {
}

module.exports = FailedTestError;
