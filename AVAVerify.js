const AVAVerifyConfig = require("./config");
const jsverify = require("jsverify");
const assert = require("assert");
const FailedTestError = require("./lib/FailedTestError");
const TestDetails = require("./lib/TestDetails");

let unnamedSuites = 0;

class AVAVerify {

  /**
   * @param {Object} [opts] control how the library is used.
   * @param {String} opts.suite a unique title for this suite of tests.  Defaults to `"JSVerify Suite [number]"`
   * @param {Function} [opts.title] a function to name each run inside this suite.  Given `opts.suite` followed by each
   *   arbitrary value.  Defaults to `${suite} run [number]`.
   * @param {Number} [opts.runs] the number of test instances to run.  Defaults to `100`.
   * @param {Number} [opts.size] the maxiumum size of generated values.  Defaults to `50`.
   * @param {Arbitrary[]} arbs the JSVerify Arbitrary values to use for each test
   * @param {Function} body the body to run for each test.  Given AVA's `t` followed by each arbitrary value.
   * @todo check that `arbs` are proper Arbitraries
  */
  constructor(opts, arbs, body) {
    if((typeof opts !== "object" || Array.isArray(opts)) && typeof body === "undefined") {
      [opts, arbs, body] = [null, opts, arbs];
    }
    this.opts = AVAVerifyConfig.use(opts);
    if(!this.opts.suite) { this.opts.suite = `JSVerify Suite ${++unnamedSuites}`; }
    if(!Array.isArray(arbs)) { throw new TypeError(`'arbs' must be an array.  Given ${typeof arbs}.`); }
    if(typeof body !== "function") { throw new TypeError(`'body' must be a function.  Given ${typeof body}.`); }
    this.arbs = arbs;
    this.body = body;
    this.run();
  }

  /**
   * Generate values given JSVerify arbitraries.
   * @param {Number} size a size to pass to the generators.
   * @param {Arbitrary[]} arbs generators for each arbitrary value.
   * @return {Promise<Array>} an array of the generated values.
   * @todo Implement `forall` better: handle a dsl string, userenv, functors, etc.
  */
  static genArbs(size, arbs) {
    const out = [];
    for (const arb of arbs) {
      assert(typeof arb.generator === "function", `must be given an Arbitrary.  Given ${arb}`);
      out.push(arb.generator(size));
    }
    return Promise.resolve(out);
  }

  /**
   * The contents to use inside an AVA `test` block for a master test that can output a summary of all JSVerify
   * responses.
   * @todo Implement.
   * @return {Function} the `test` block contents.
  */
  masterBody() {
    return (t) => {
      t.plan(0);
      t._test.metadata.type = "ava-verify master";
    };
  }

  /**
   * Shrink and retry a failing test.
   * @param {Test} t the `Test` object from an AVA test
   * @param {TestDetails} details the details about the current test.
   * @return {Promise} resolves when testing is complete.
   * @todo Implement.
  */
  retryBody(t, details) {

  }

  /**
   * The contents to use inside an AVA `test` block to run a test instance.
   * @param {Number} i the test index
   * @todo Publicize `TestDetails` object being in `t.context` (warn that it is unstable)
   * @return {Function} the `test` block contents.
  */
  testBody(i) {
    return (t) => {
      const details = new TestDetails({
        verify: this,
        index: i,
      });
      t.context._avaVerify = details;
      return this.constructor
        .genArbs(this.opts.size, this.arbs)
        .then(vals => details.storeFirstValues(vals))
        .then(vals => this.body(t, ...vals))
        .then(() => {
          if(t.assertError || t.calledEnd) {
            throw new FailedTestError();
          }
          // TODO: broadcast test success
        })
        .catch(err => {
          details.failed = true;
          details.failureDetails = this.constructor.getFailureDetails(t);
          // TODO: catch any other test failures?  err.name === AssertionError?
          const retriable = err instanceof FailedTestError;
          if(details.shrink && retriable) {
            return this
              .retryBody(t, details)
              .then(() => this.constructor.restoreFailureDetails(t, details.failureDetails))
              .then(() => {
                //TODO: broadcast test finish
                //TODO: if test rejected above, reject again?
                return true;
              });
          }
          else {
            //TODO: broadcast test finish
            throw err;
          }
        });
    };
  }

  /**
   * Generate AVA `test` blocks for each test instance that should be run.
   * @return {AVAVerify} `this` for chaining.
  */
  run() {
    const test = require("ava");
    if(this.opts.runs < 1) { return; }
    test(`${this.opts.suite} Tests`, this.masterBody());
    for(let i = 0; i<this.opts.runs; i++) {
      test(`${this.opts.suite} run ${i + 1}`, this.testBody(i));
    }
  }

}

module.exports = AVAVerify;
