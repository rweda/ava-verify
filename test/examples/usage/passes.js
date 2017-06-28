const test = require("ava");
const { example, examples } = require("test/examples/helpers/run-example");

const suffix = Math.random().toString(36).slice(2, 6);

example({
  name: "usage",
  suffix,
});

test("exits with code 0", t => {
  if(examples.usage.code != 0) {
    console.log("Output from 'usage':");
    console.log(examples.usage.output);
  }
  t.is(examples.usage.code, 0);
});

test("runs 100 tests", t => {
  t.not(examples.usage.output.indexOf(`100 passed`), -1);
});
