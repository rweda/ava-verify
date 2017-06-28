const assert = require("assert");

/**
 * An internal assertion library.  Allows custom assertions (like using AVA's `t` object).
*/
class Assert {

  /**
   * Assert that `val` is `true`.
   * @param {Boolean} val will ensure value is `true`
   * @param {String} [msg] optional message to include.
  */
  true(val, msg) {
    return assert.ok(val, msg);
  }

}

class AVAAssert extends Assert {

  /**
   * @param {Test} t AVA's `t` object.
  */
  constructor(t) {
    this.t = t;
  }

  true(val, msg) {
    this.t.true(val, msg);
  }

}

module.exports = { Assert, AVAAssert };
