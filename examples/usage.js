/**** Statistics for testing ****/
Promise.defer = require("promise-defer");
const runs = [];
for(let i = 0; i < 100; i++) { runs[i] = Promise.defer(); }

/**** Example code: ****/

const jsc = require("jsverify");
jsc.ava = require("index");

let i = 0;
jsc.ava([ jsc.number ], (t, num) => {
  t.plan(2);
  t.is(typeof num, "number");
  t.true(true);
  runs[i].resolve({ num });
  ++i;
});

/**** Parse Statistics ****/

const suffix = process.env.TEST_SUFFIX || Math.random().toString(36).slice(2, 6);
const dir = `${__dirname}/stats`;
const stats = `${dir}/usage-${suffix}.json`;
const fs = require("fs-extra");
fs
  .ensureDir(dir)
  .then(() => Promise.all(runs.map(r => r.promise)))
  .then(data => fs.writeFile(stats, JSON.stringify(data)))
  .then(() => console.log(`Wrote statistics to ${stats}.`));
