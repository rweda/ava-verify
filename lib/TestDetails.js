const merge = require("lodash.merge");
const FailureDetails = require("./FailureDetails");

/**
 * Internal data about a single test instance.
 * @property {Number} index the index of this test in the {@link AVAVerify} suite.
 * @property {Number} attempt the number of times this test instance has been tried.  `0` for the first run, and `1` for
 *   the first retry.  Defaults to `0`.
 * @property {Boolean} shrink user can set this to `false` to disable shrinking.  Shrinking will not be attempted if
 *   either this is set, or other internal checks fail.  Defaults to `true`.
 * @property {AVAVerify} [verify] a link back to the {@link AVAVerify} instance.  Not to be used inside AVAVerify, but
 *   can be used by user tests if needed.
 * @property {Boolean} failed `true` if the first attempt failed.
 * @property {FailureDetails} failureDetails details from the first failing run.
 * @property {Any[]} firstValues the generated values for the first run of this test.
*/
class TestDetails {

  constructor(opts) {
    merge(this, {
      attempt: 0,
      shrink: true,
      failed: false,
      failureDetails: new FailureDetails(),
    }, opts);
    if(typeof this.index !== "number") { throw new TypeError(`'index' is a required field.  Given ${typeof index}.`); }
  }

  /**
   * Store the initial generated values for this test.
   * @param {Any[]} vals the generated values
   * @return {Any[]} the given values
  */
  storeFirstValues(vals) {
    this.firstValues = vals;
    return vals;
  }

}

module.exports = TestDetails;
