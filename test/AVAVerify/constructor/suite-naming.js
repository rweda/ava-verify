const test = require("ava");
const AVAVerify = require("AVAVerify");

test("uses user-submitted name if provided", t => {
  const suite = "my-suite";
  const verify = new AVAVerify({ suite, runs: 0 }, [], t => {});
  t.is(verify.opts.suite, suite);
});

const suiteMatch = /^JSVerify Suite ([0-9]+)$/;

test("assigns incrementing random suite names if not provided", t => {
  const verify = new AVAVerify({ runs: 0 }, [], t => {});
  t.is(suiteMatch.exec(verify.opts.suite)[1], "1", "names start at 1");
  const verify2 = new AVAVerify({ runs: 0 }, [], t => {});
  t.is(suiteMatch.exec(verify2.opts.suite)[1], "2", "names increment");
});
