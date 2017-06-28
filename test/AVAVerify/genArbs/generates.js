const test = require("ava");
const jsc = require("jsverify");
const AVAVerify = require("AVAVerify");

test("generates values", t => {
  t.plan(2);
  return AVAVerify
    .genArbs(50, [ jsc.string ])
    .then((val) => {
      t.true(Array.isArray(val));
      t.is(typeof val[0], "string");
    });
});

test("returns array of values", t => {
  t.plan(3);
  return AVAVerify
    .genArbs(50, [ jsc.string, jsc.number ])
    .then(val => {
      t.true(Array.isArray(val));
      t.is(typeof val[0], "string");
      t.is(typeof val[1], "number");
    });
});
