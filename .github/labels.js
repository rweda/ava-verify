/**
 * Syncs labels with GitHub.
 * Usage:
 * $ npm install github-label-sync color-convert
 * $ ACCESS_TOKEN="<personal access token>" node labels.js
 *
 * When changing label names, provide an alias: `{ name: "New Name", aliases: [ "Old Name" ] }`.
*/

const sync = require("github-label-sync");
const convert = require("color-convert");
const phi = 0.618033988749895;
let _hue = 90 / 256;

function category(hue, labels) {
  if(Array.isArray(hue)) { [hue, labels] = [null, hue]; }
  if(!hue) {
    _hue += phi;
    _hue %= 1;
    hue = _hue;
  }
  const satDelta = 1 / (2 * labels.filter(label => !label.color).length);
  let saturation = 0.25;
  for(const label of labels) {
    if(label.color) { continue; }
    label.color = convert.hsv.hex(hue * 256, saturation * 100, 99);
    saturation += satDelta;
  }
  return labels;
}

const labels = [
  { name: "Epic", color: "3E4B9E" },
  ...category([
    { name: "Type: Documentation" },
    { name: "Type: Test" },
    { name: "Type: Maintenance" },
    { name: "Type: Discussion" },
    { name: "Type: Question" },
    { name: "Type: Feature" },
    { name: "Type: Bug", color: "b60205" },
  ]),
  ...category([
    { name: "Resolution: Duplicate" },
    { name: "Resolution: Won't Fix" },
  ]),
];


sync({
  accessToken: process.env.ACCESS_TOKEN,
  repo: "rweda/ava-verify",
  labels,
})
