const test = require("ava");
const { example, examples } = require("test/examples/helpers/run-example");

const suffix = Math.random().toString(36).slice(2, 6);

example({
  name: "usage",
  suffix,
});

test("tests multiple data points", t => {
  const data = require(`examples/stats/usage-${suffix}.json`);
  const tested = {};
  let dataPoints = 0;
  for (const { num } of data) {
    if(typeof tested[num] !== "number") {
      ++dataPoints;
      tested[num] = 1;
    }
    ++tested[num];
  }
  t.true(dataPoints > 20);
});
