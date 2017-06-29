/**
 * From https://stackoverflow.com/a/32749533/666727
*/
class ExtendableError extends Error {
  constructor(msg) {
    super(message);
    this.name = this.constructor.name;
    if(typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
    else {
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = ExtendableError;
