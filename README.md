# JSVerify Plugin for AVA

[JSVerify][] test runner that takes advantage of [AVA][]'s power.

It's possible to run [JSVerify][] tests inside [AVA][]:

```js
const test = require("ava");
const jsc  = require("jsverify");

test("addition", t => {
  t.plan(0);
  jsc.assert(jsc.forall(jsc.int, jsc.int, jsc.int, (a, b, c) => {
    return a + b === c;
  }));
});
```

However, this ignores most of AVA's advantages: JSVerify will run the `forall` body an unknown number of times, so we
can't use test planning and JSVerify's assertion library.

Instead, `ava-jsverify` creates an environment that takes advantage of AVA's power.

```js
// Require `ava` yourself if you have tests that don't use `ava-jsverify`, but `ava-jsverify` will require `ava` itself.
// const test = require("ava");
const jsc = require("jsverify");
jsc.ava = require("ava-jsverify");

jsc.ava({
  suite: "addition",
  title: (suite, a, b, c) => `${suite}: ${a}+${b}=${c}`;
  runs: 50,
  passing: "hide",
  subseqFail: "skip",
}, [ jsc.int, jsc.int, jsc.int ], (t, a, b, c) => {
  t.plan(2);
  t.is(typeof a, "number");
  t.is(a + b, c);
});
```

Behind the scenes, `ava-jsverify` will create 50 (`runs`) separate `test()` instances, one for each JSVerify run
requested.
Each instance will generate instances of the given JSVerify arbitraries (`jsc.int`), set it's title based on `title`,
and run the given test body.

If any of the instances fail, `ava-jsverify` will shrink the arbitraries and rerun the test body, increasing `t.plan`
for you.

When the test has been shrunk as far as possible while still failing, the last failure will appear in the console
without any JSVerify information - [power-assert][] will display values for `a`, `b`, `a + b`, and `c`.

On failure, an internal AVA `test` block (named `${suite} JSVerify Suite`) will contain the JSVerify information,
including the values of each arbitrary, and the number of shrinks used to produce the final failing case.
If no tests are failing, `ava-jsverify` will hide this internal test block from `ava`.

The output that AVA displays is completely customizable!
Want the 50 passing runs to each be counted as a successful test?  Set `passing` to `"show"`.  Want it counted as a
single passing test?  Set `passing` to `"hide"`, and each of the runs will be hidden from AVA's output, and the internal
test block (with the suite title) will be shown as passing.

By default, when multiple runs fail, only the first failure is shown - the internal `test` block will display the
JSVerify details, the failing block will be displayed, and all subsequent failures will be hidden.
(passing runs will be shown if `passing` is set to `"show"`)
Alternatively, `firstFail` can be set to `"hide"` to only show the JSVerify information, or `subseqFail` can be set to
`"show"` to show each failing test.

Each of the configuration options mentioned above, as well as a bunch more that were omitted, are described in much more
detail in the documentation.

[JSVerify]: https://github.com/jsverify/jsverify
[AVA]: https://github.com/avajs/ava
[power-assert]: https://github.com/power-assert-js/power-assert
