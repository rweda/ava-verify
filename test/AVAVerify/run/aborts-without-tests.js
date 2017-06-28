const test = require("ava");
const mock = require("mock-require");
const delay = require("promise-delay");

test("doesn't define any tests if 'runs' < 1", t => {
  t.plan(2);
  let testCalled = false;
  let bodyCalled = false;
  mock("ava", {
    test: () => { testCalled = true; },
  });
  const AVAVerify = require("AVAVerify");
  const verify = new AVAVerify({ runs: 0 }, [], (t) => {
    bodyCalled = true;
  });
  return delay(25)
    .then(() => {
      t.false(testCalled);
      t.false(bodyCalled);
    });
});
