# JSVerify Plugin for AVA

Futuristic test features from [AVA][] integrated with [JSVerify][] test-case generation.

[![npm](https://img.shields.io/npm/v/ava-verify.svg)](https://www.npmjs.com/package/ava-verify)
[![Build Status](https://travis-ci.org/rweda/ava-verify.svg?branch=master)](https://travis-ci.org/rweda/ava-verify)
[![Codecov](https://img.shields.io/codecov/c/gh/rweda/ava-verify.svg)](https://codecov.io/gh/rweda/ava-verify)

## Features

- Runs generated test-cases in parallel
- ![][in-progress] Shrinking failing test cases to produce small counter-examples ([#1][])
- ![][planned] Full JSVerify output, including seed, counter-examples, etc. ([#12][])
- ![][soon] Each test case can be given a unique name based on the generated values ([#2][])

Many more features are planned.
See the [issue tracker](https://github.com/rweda/ava-verify/issues) for the current list.

## Background

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

Instead, `ava-verify` creates an environment that takes advantage of AVA's power.

```js
// Require `ava` yourself if you have tests that don't use `ava-verify`, but `ava-verify` will require `ava` itself.
// const test = require("ava");
const jsc = require("jsverify");
jsc.ava = require("ava-verify");

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

Given the **options**, a list of **arbitraries** to generate, and a **test body**,
`ava-verify` will create individual AVA tests for each **test instance** specified (by the `runs` option).

As each test instance is in it's own AVA test, you can use AVA's test planning and [power-assert][] interface
to produce descriptive assertion messages.

[![][in-progress]][#1] When each test instance fails, the generated variables will be shrunk and retried to produce
smaller counter-examples according to the JSVerify `shrink` system.
The internal AVA variables will be reset, so test planning and previous failures won't affect the retried test.

[![][planned]](#9) Optionally, subsequent test failures can be canceled and hidden, reducing the amount of output.

[![][on-hold]](#14) In addition, successful test cases can be hidden, so the number of successful tests is 1 per test
suite, instead of 1 for each test case in a test suite.

## Installation

```sh
npm install --save-dev ava-verify
```

## Usage

Require `ava-verify` in your tests:

```js
const jsc = require("jsverify");
jsc.ava = require("ava-verify");
```
(You can replace `jsc.ava` with any variable)

`jsc.ava` is a function that allows you to call the `AVAVerify` class without using `new`.  Any arguments passed to
the exported function will be handed to the `AVAVerify` class.

You can directly access the class through `require("ava-verify/AVAVerify")`, or `require("ava-verify").AVAVerify`.

[#1]:  https://github.com/rweda/ava-verify/issues/1
[#2]:  https://github.com/rweda/ava-verify/issues/2
[#9]:  https://github.com/rweda/ava-verify/issues/9
[#12]: https://github.com/rweda/ava-verify/issues/12
[#14]: https://github.com/rweda/ava-verify/issues/14
[JSVerify]: https://github.com/jsverify/jsverify
[AVA]: https://github.com/avajs/ava
[power-assert]: https://github.com/power-assert-js/power-assert
[planned]: https://img.shields.io/badge/status-planned-red.svg
[soon]: https://img.shields.io/badge/status-coming_soon-orange.svg
[in-progress]: https://img.shields.io/badge/status-in_progress-yellow.svg
[on-hold]: https://img.shields.io/badge/status-on_hold-lightgrey.svg
