const modconf = require("modconf");

/**
 * @todo When `modconf` can produce JSDoc `typedef` statements, add descriptions and use inside AVAVerify.
*/

module.exports = modconf
  .module("npm:ava-verify")
  .option(String, "suite")
  .option(Function, "title")
  .option(Number, "size", {
    default: 50,
  })
  .option(Number, "runs", {
    default: 100,
  });
