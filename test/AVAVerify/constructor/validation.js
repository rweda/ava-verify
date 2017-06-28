const test = require("ava");
const jsc = require("jsverify");
const AVAVerify = require("AVAVerify");
const ValueGenerator = require("@rweda/jsverify-generators/Val");

test("AVAVerify throws TypeError if 'arbs' isn't 'array'", t => {
  t.plan(100);
  jsc.assert(jsc.forall(ValueGenerator({ array: false }), val => {
    t.throws(() => new AVAVerify({ runs: 0 }, val, t => { return; }), TypeError);
    return true;
  }));
});

test("AVAVerify throws TypeError if 'body' isn't 'function'", t => {
  t.plan(100);
  jsc.assert(jsc.forall(ValueGenerator(), val => {
    t.throws(() => new AVAVerify({ runs: 0 }, [], val), TypeError);
    return true;
  }));
});
