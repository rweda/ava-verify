const test = require("ava");
const path = require("path");
const {exec} = require("child-process-promise");

/**
 * Stores data from each test run.
*/
const examples = {};

/**
 * Creates an AVA `before` block that runs AVA on an example test.
 * @param {Object} opts configuration options
 * @param {String} opts.name the name of the example to run.
 * @param {String} opts.suffix sets `TEST_SUFFIX`, used to write statistics files in some examples.
*/
function example(opts) {
  test.before("run example", t => {
    const root = path.resolve(`${__dirname}/../../../`);
    const execOpts = {
      cwd: root,
      env: {
        NODE_PATH: root,
        TEST_SUFFIX: opts.suffix,
      },
    };
    return exec(`node_modules/.bin/ava examples/${opts.name}.js`, execOpts)
      .catch(err => err)
      .then(res => {
        examples[opts.name] = {
          code: typeof res.code === "number" ? res.code : 0,
          stdout: res.stdout,
          stderr: res.stderr,
          output: res.stdout + res.stderr,
        };
      });
  });
}

module.exports = {
  example,
  examples,
};
