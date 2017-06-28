/**
 * Stores details about an AVA test failure, which can be used to save and reset variables when re-running tests.
 * @property {Number} assertCount
 * @property {Error} [assertError]
 * @property {Boolean} calledEnd
 * @property {Number} [duration]
 * @property {Number} pendingAssertionCount
 * @property {Number} [planCount]
 * @property {Number} startedAt
 * @see https://github.com/avajs/ava/blob/854203a728c4dff3ea61a3bcf49f1dfae04c7657/lib/test.js#L103
 * @todo Write unit tests
*/
class FailureDetails {

  /**
   * The test properties that need to be saved and reset between test attempts.
  */
  static get testProperties() {
    return [
      "assertCount",
      "assertError",
      "calledEnd",
      "duration",
      "pendingAssertionCount",
      "planCount",
      "startedAt",
    ];
  }

  /**
   * Copy the test details that should be saved between test attempts.
   * @param {Test|FailureDetails} source the object to copy details from
   * @param {Test|FailureDetails} dest the object to store details in
   * @return {Test|FailureDetails} the destination object
  */
  static copyTestDetails(source, dest) {
    for(const property of this.testProperties) {
      dest[property] = source[property];
    }
    return dest;
  }

  /**
   * Extract the internal AVA details after a test failure.
   * @param {Test} t the current Test object (`t` in AVA)
   * @return {FailureDetails} details about the test failure.
   * @todo Create and use a `typedef` for the return type.  Use in other methods.
  */
  static getFailureDetails(t) {
    return this.copyTestDetails(t, new FailureDetails());
  }

  /**
   * Restore the internal AVA details after retrying tests.
   * @param {Test} t the current Test object (`t` in AVA)
   * @param {FailureDetails} failureDetails the saved details about the test failure
   * @return {Test} the given Test object.
  */
  static restoreFailureDetails(t, failureDetails) {
    return this.copyTestDetails(failureDetails, t);
  }

  /**
   * Reset the internal AVA details to prepare a clean testing environment.
   * Creates a `{Test}` object from AVA, and copies it's default properties into the given `{Test}`.
   * @param {Test} t the current Test object (`t` in AVA)
   * @return {Test} the given Test object.
  */
  static resetTest(t) {
    const AVATest = require("ava/lib/test");
    const _test = new AVATest();
    return this.copyTestDetails(_test, t);
  }

}

module.exports = FailureDetails;
